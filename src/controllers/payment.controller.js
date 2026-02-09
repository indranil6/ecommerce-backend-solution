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

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentId: razorpay_payment_id,
    },
  });

  // Clear cart after successful payment
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  await prisma.cartItem.deleteMany({
    where: { cart: { userId: order.userId } },
  });

  res.json({ message: "Payment successful" });
};
