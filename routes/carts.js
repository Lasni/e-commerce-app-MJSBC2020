const express = require("express");
const cartsRepo = require("../repositories/carts");

const router = express.Router();

// add item to cart POST
router.post("/cart/products", async (req, res) => {
  let cart;

  if (!req.session.cartId) {
    // no cart -> need to create one and store it in cookie
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id; // storing in cookie
  } else {
    // have a cart -> get it from cartRepo via cartId
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array and save cart
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  console.log(cart);
  res.send("product added to cart");
});

// show all items in cart GET

// delete an item from cart POST

module.exports = router;
