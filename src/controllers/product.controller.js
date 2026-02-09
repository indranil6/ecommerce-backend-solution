const prisma = require("../lib/prisma");

// GET all products
exports.getProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
  });

  res.json(products);
};

// GET product by slug
exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

// CREATE product
exports.createProduct = async (req, res) => {
  const { title, slug, price, description, categoryId, images } = req.body;

  const product = await prisma.product.create({
    data: {
      title,
      slug,
      price,
      description,
      categoryId,
      images: {
        create: images.map((url) => ({ url })),
      },
    },
    include: {
      category: true,
      images: true,
    },
  });

  res.status(201).json(product);
};
