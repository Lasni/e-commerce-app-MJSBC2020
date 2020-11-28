const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");

const app = express();

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["hfi0437u8ygh9u3"], // encryption key
  })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);

app.listen(PORT, () => {
  console.log("Listening");
});
