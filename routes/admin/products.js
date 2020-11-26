// libraries
const express = require("express");
const multer = require("multer");
// internal
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitleNew, requirePriceNew } = require("./validators");
const { handleErrors } = require("./middlewares");
// setup
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  upload.single("image"), // image upload middleware
  [requireTitleNew, requirePriceNew], // input checking middleware
  handleErrors(productsNewTemplate), // error checking middleware
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    res.send("submitted");
  }
);

module.exports = router;
