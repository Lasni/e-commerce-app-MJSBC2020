// lib imports
const express = require("express");
// internal imports
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmailSignUp,
  requirePasswordSignUp,
  requirePasswordConfirmationSignUp,
  requireEmailSignIn,
  requirePasswordSignIn,
} = require("./validators");
const { handleErrors } = require("./middlewares");
// setup
const router = express.Router();

// SIGN UP
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [
    requireEmailSignUp,
    requirePasswordSignUp,
    requirePasswordConfirmationSignUp,
  ],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    // Create a user in our user repo
    const user = await usersRepo.create({ email, password });
    // Store the id of that user inside the user's cookie
    req.session.userId = user.id; // added by cookie-session
    res.redirect("/admin/products");
  }
);

// SIGN IN
router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailSignIn, requirePasswordSignIn],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

// SIGN OUT
router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

module.exports = router;

// NOT USED
// const bodyParser = (req, res, next) => {
//   if (req.method === "POST") {
//     req.on("data", (data) => {
//       const parsed = data.toString("utf8").split("&");
//       const formData = {};

//       for (let pair of parsed) {
//         const [key, value] = pair.split("=");
//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// };
