// cart.controller.js

const { Cart } = require("../../models/Cart");
const { Product } = require("../../models/Product");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let price;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    let product = await Product.findById(productId);

    if (itemIndex > -1) {
      // Product exists in cart
      var qty = (
        parseInt(cart.items[itemIndex].quantity) + parseInt(quantity)
      ).toString();
      console.log("c>>>>>" + qty);

      cart.items[itemIndex].quantity = qty;
      price = product.price;

      // Update totals
      const updatedQty = cart.items[itemIndex].quantity;

      cart.items[itemIndex].totalForIndividualProduct = updatedQty * price;
    } else {
      // New product
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      price = product.price;
      console.log(product.name);
      const itemPrice = quantity * price;

      cart.items.push({
        name: product.name,
        description: product.description,
        image: product.image,
        product: productId,
        quantity: quantity,
        totalForIndividualProduct: itemPrice,
        itemPrice: price,
        inStock: product.inStock,
      });
    }

    let newCartTotal = 0;
    cart.items.forEach((item) => {
      newCartTotal =
        parseInt(newCartTotal) + parseInt(item.totalForIndividualProduct);
    });
    cart.cartTotal = newCartTotal;

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send({ err });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      // Get updated price
      const product = await Product.findById(productId);
      const price = product.price;

      item.totalForIndividualProduct = item.quantity * price;
    }

    // Recalculate cart total
    let newCartTotal = 0;

    cart.items.forEach((item) => {
      newCartTotal =
        parseInt(newCartTotal) + parseInt(item.totalForIndividualProduct);
    });

    cart.cartTotal = newCartTotal;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating cart" });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        items: [],
        cartTotal: 0,
      });
    }

    // Recalculate totals
    let newCartTotal = 0;

    for (let item of cart.items) {
      // Fetch product for price
      const product = await Product.findById(item.product);

      // Update item total
      item.totalForIndividualProduct = item.quantity * product.price;

      // Update cart total
      newCartTotal =
        parseInt(newCartTotal) + parseInt(item.totalForIndividualProduct);
    }

    cart.cartTotal = newCartTotal;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting cart data" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getUserCart,
};
