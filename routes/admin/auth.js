const express = require("express");
const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

// SIGN UP
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [check("email").isEmail(), check("password"), check("passwordConfirmation")],
  async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneUserBy({ email });
    // Check if user already exists
    if (existingUser) {
      return res.send(`Email ${email} is already taken`);
    }
    // Check if passwords match
    if (password !== passwordConfirmation) {
      return res.send(`Passwords must match`);
    }
    // Create a user in our user repo
    const user = await usersRepo.createUser({ email, password });
    // Store the id of that user inside the user's cookie
    req.session.userId = user.id; // added by cookie-session
    res.send("Account created");
  }
);

// SIGN IN
router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneUserBy({ email });
  if (!user) {
    return res.send(`Email ${email} not found`);
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid password");
  }

  req.session.userId = user.id;
  res.send("You are signed in");
});

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
