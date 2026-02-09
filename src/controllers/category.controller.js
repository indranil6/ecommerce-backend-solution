const prisma = require("../lib/prisma");

// GET all categories
exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

// CREATE category
exports.createCategory = async (req, res) => {
  const { name, slug, image } = req.body;

  const category = await prisma.category.create({
    data: { name, slug, image },
  });

  res.status(201).json(category);
};
