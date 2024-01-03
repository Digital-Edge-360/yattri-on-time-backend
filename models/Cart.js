// models/cart.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId, 
        ref: 'Product'
      },
      name: String,
      description: String,
      image: String,
      inStock: Boolean,
      quantity: { 
        type: String,
        default: '1'
      },
      totalForIndividualProduct: {
        type: String, 
        default: '0'
      },
      itemPrice: {
        type: String,
        default: '0'  
      }
    }
  ],
  cartTotal: {
    type: String,
    default: '0'  
  }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = { Cart }