import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    res.json(cart || { user: req.user._id, products: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// POST /api/cart (add item)
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ message: 'productId and quantity are required' });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    const existingIndex = cart.products.findIndex((p) => p.product.toString() === productId);
    if (existingIndex > -1) {
      cart.products[existingIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    cart.lastUpdated = new Date();
    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:productId (update quantity)
router.put('/:productId', protect, async (req, res) => {
  const { quantity } = req.body;
  if (quantity == null) {
    return res.status(400).json({ message: 'quantity is required' });
  }
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const item = cart.products.find((p) => p.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }
    item.quantity = quantity;
    cart.lastUpdated = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:productId (remove item)
router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.products = cart.products.filter((p) => p.product.toString() !== req.params.productId);
    cart.lastUpdated = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
});

export default router;

