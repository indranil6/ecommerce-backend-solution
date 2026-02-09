const prisma = require("../lib/prisma");

// Helper: get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  return cart;
};

// GET /api/cart
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      },
    },
  });

  res.json(cart || { items: [] });
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  res.status(201).json(item);
};

// PUT /api/cart/update
exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be >= 1" });
  }

  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    data: { quantity },
  });

  res.json(item);
};

// DELETE /api/cart/remove/:productId
exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId);

  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  res.json({ message: "Item removed from cart" });
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  res.json({ message: "Cart cleared" });
};
