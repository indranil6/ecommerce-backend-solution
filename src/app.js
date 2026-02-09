const express = require("express");

const app = express();

app.use(express.json());

app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payment", require("./routes/payment.routes"));

app.get("/", (req, res) => {
  res.send("E-commerce Backend is running 🚀");
});

module.exports = app;
