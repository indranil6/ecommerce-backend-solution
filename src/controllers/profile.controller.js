const prisma = require("../lib/prisma");

// Get user profile
exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  res.json(profile);
};

// Create / update profile
exports.upsertProfile = async (req, res) => {
  const userId = req.user.id;

  const { name = "", phone = "", profileImage = "" } = req.body;
  if (phone) {
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {
      name,
      phone,
      profileImage,
    },
    create: {
      userId,
      name,
      phone,
      profileImage,
    },
  });

  res.json(profile);
};
