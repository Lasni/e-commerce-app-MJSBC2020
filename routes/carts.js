const express = require("express");

const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

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
  res.redirect("/cart");
});

// show all items in cart GET
router.get("/cart", async (req, res) => {
  // if no cart created, redirect back to home page
  if (!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    // item === {id, quantity}
    const product = await productsRepo.getOne(item.id);
    item.product = product; // just assigning product obj to item.product for further templating
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

// delete an item from cart POST
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  let cart;
  cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });

  // if deleted last item, redirect to products
  cart = await cartsRepo.getOne(req.session.cartId);
  if (cart.items.length === 0) {
    return res.redirect("/");
  }

  res.redirect("/cart");
});

module.exports = router;
