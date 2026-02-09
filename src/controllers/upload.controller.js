const supabase = require("../lib/supabase");

exports.uploadProductImage = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { v4: uuidv4 } = await import("uuid");

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const { data } = supabase.storage.from("products").getPublicUrl(filePath);

  res.status(201).json({ url: data.publicUrl });
};
