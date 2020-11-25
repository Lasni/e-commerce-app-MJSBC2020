const express = require("express");
const router = express.Router();
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitleNew, requirePriceNew } = require("./validators");
const { check, validationResult } = require("express-validator");

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  [requireTitleNew, requirePriceNew],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    res.send("submitted");
  }
);

module.exports = router;
