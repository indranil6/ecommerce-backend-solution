const prisma = require("../lib/prisma");

// POST /api/orders/create
exports.createOrderFromCart = async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.body;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalAmount = 0;

  const orderItems = cart.items.map((item) => {
    totalAmount += item.product.price * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId,
      shippingAddressId: addressId,
      totalAmount,
      items: {
        create: orderItems,
      },
    },
    include: { items: true },
  });

  res.status(201).json(order);
};
//order history
exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
      shippingAddress: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const userId = req.user.id;
  const orderId = parseInt(req.params.id);

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};
