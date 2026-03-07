const express = require("express");

const app = express();
const cors = require("cors");

app.use(express.json());

//enable CORS for all routes
app.use(cors());

app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/orderstatus", require("./routes/orderStatus.routes"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/addresses", require("./routes/address.routes"));

app.get("/", (req, res) => {
  res.send("E-commerce Backend is running 🚀");
});

module.exports = app;
