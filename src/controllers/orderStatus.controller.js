const prisma = require("../lib/prisma");

// ADMIN: update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["SHIPPED", "DELIVERED"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "PAID" && status === "SHIPPED") {
    return res
      .status(400)
      .json({ message: "Order must be PAID before shipping" });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(orderId) },
    data: { status },
  });

  res.json(updatedOrder);
};

// USER: check delivery status
exports.getOrderStatus = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(orderId),
      userId,
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    orderId: order.id,
    status: order.status,
    updatedAt: order.updatedAt,
  });
};
