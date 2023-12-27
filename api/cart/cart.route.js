// cart.route.js

const { validateTocken } = require("../../auth/tokenValidator");

const { 
    addToCart,
    removeFromCart,
    getUserCart
  } = require('./cart.controller');
  
  const router = require("express").Router();

  router.post('/', validateTocken, addToCart);  
  
  router.delete('/:productId', validateTocken, removeFromCart);
  
  router.get('/', validateTocken, getUserCart);
  
  module.exports = router;