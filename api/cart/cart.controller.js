// cart.controller.js

const { Cart } = require('../../models/Cart');
const { User } = require('../../models/User');
const { Product } = require('../../models/Product'); 


// Add item to cart 
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let product;
    const userId = req.user._id;
    let cart = await Cart.findOne({user: userId});
    if(!cart) {
      cart = await Cart.create({user: userId});
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if(itemIndex > -1) {
      // Existing product, get from items  
      product = cart.items[itemIndex].product;
    } else {
      // New product, fetch from DB
      product = await Product.findById(productId);
      if(!product) {
        return res.status(404).send('Product not found');
      }
    }
    // Calculate prices
    const price = product.price;
    console.log(">>>>>"+quantity*price);
    if(itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].totalPrice += quantity * price;  
    } else {
      const totalForIndividualProduct = quantity * product.price;    
      cart.items.push({ 
        product: productId,
        quantity,
        totalForIndividualProduct,
      });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});    
  }
}
  
// Remove item from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const cart = await Cart.findOne({userId})
    .populate('items.product');
  const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
  if(itemIndex > -1) {
    const item = cart.items[itemIndex];
    if(item.quantity > 1) {  
      item.quantity--;
    } else {
      cart.items.splice(itemIndex, 1);
    }
  }
  // Recalculate cart total
  cart.cartTotal = cart.items.reduce((acc, item) => {
    return acc + (item.quantity * item.product.price)
  }, 0);
  await cart.save();
  res.json(cart);
}

// Get user cart
const getUserCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({userId})
    .populate({
      path: 'items.product',
      select: 'name price'
    });
  // Check if cart exists and is not empty
  if(!cart || cart.items.length === 0) {
    return res.status(200).json({
      items: [],
      cartTotal: 0
    });
  }
  // Rest of cart total calculation logic
  cart.items.forEach(item => {
    item.totalForIndividualProduct = item.quantity * item.product.price;  
  });  
  cart.cartTotal = cart.items.reduce((total, item) => {
    return total + (item.quantity * item.product.price);
  }, 0);
  res.json(cart);
}

module.exports = {
  addToCart,
  removeFromCart,
  getUserCart  
}