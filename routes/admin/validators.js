const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  // PRODUCTS
  requireTitleNew: check("title").trim().isLength({ min: 5, max: 40 }),
  requirePriceNew: check("price").trim().toFloat().isFloat({ min: 1 }),

  // USERS
  requireEmailSignUp: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      // Check if user already exists
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email in use");
      }
    }),
  requirePasswordSignUp: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters long"),
  requirePasswordConfirmationSignUp: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters long")
    .custom((passwordConfirmation, { req }) => {
      // Check if passwords match
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match!!");
      }
    }),
  requireEmailSignIn: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found");
      }
    }),
  requirePasswordSignIn: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid password");
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error("Invalid password");
      }
    }),
};
