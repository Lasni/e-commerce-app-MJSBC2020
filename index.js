const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["hfi0437u8ygh9u3"], // encryption key
  })
);
app.use(authRouter);

app.listen(PORT, () => {
  console.log("Listening");
});
