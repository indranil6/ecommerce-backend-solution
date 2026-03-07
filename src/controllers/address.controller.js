const prisma = require("../lib/prisma");

// GET all addresses
exports.getAddresses = async (req, res) => {
  const userId = req.user.id;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(addresses);
};

// CREATE address
exports.createAddress = async (req, res) => {
  const userId = req.user.id;

  const address = await prisma.address.create({
    data: {
      userId,
      ...req.body,
    },
  });

  res.status(201).json(address);
};

// UPDATE address
exports.updateAddress = async (req, res) => {
  const { id } = req.params;

  const address = await prisma.address.update({
    where: { id: parseInt(id) },
    data: req.body,
  });

  res.json(address);
};

// DELETE address
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  await prisma.address.delete({
    where: { id: parseInt(id) },
  });

  res.json({ message: "Address deleted" });
};

// SET DEFAULT address
exports.setDefaultAddress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  const address = await prisma.address.update({
    where: { id: parseInt(id) },
    data: { isDefault: true },
  });

  res.json(address);
};
