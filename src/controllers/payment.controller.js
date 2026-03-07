const razorpay = require("../lib/razorpay");
const prisma = require("../lib/prisma");
const crypto = require("crypto");

// POST /api/payment/create
exports.createPayment = async (req, res) => {
  const { orderId } = req.body;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.status !== "PENDING") {
    return res.status(400).json({ message: "Invalid order" });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100, // paise
    currency: "INR",
    receipt: `order_${order.id}`,
  });

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
};
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    // Step 1: Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Step 2: Get order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent duplicate processing
    if (order.status === "PAID") {
      return res.json({ message: "Payment already verified" });
    }

    // Step 3: Transaction
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentId: razorpay_payment_id,
        },
      });

      // Update inventory
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: order.userId,
          },
        },
      });
    });

    res.json({ message: "Payment successful and order confirmed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};
