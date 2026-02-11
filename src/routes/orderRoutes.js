import express from 'express';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

const computePriceByUserType = (product, userType) => {
  if (!product.pricing) return 0;
  if (userType === 'admin') return product.pricing.admin_price;
  if (userType === 'vip_customer') return product.pricing.vip_customer_price;
  return product.pricing.customer_price;
};

// POST /api/orders (create order from cart)
router.post('/', protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ message: 'shippingAddress and paymentMethod are required' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const populatedProducts = await Product.find({
      _id: { $in: cart.products.map((p) => p.product) },
    });

    const orderItems = cart.products.map((item) => {
      const product = populatedProducts.find((p) => p._id.toString() === item.product.toString());
      const price = computePriceByUserType(product, req.user.userType);
      return {
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: price,
      };
    });

    // Stock validation: ensure each product has enough stock
    for (const item of cart.products) {
      const prod = populatedProducts.find((p) => p._id.toString() === item.product.toString());
      if (!prod) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      if (prod.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${prod.name}` });
      }
    }

    const totalPrice = orderItems.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      totalPrice,
      userType_at_purchase: req.user.userType,
      shippingAddress,
      paymentMethod,
    });

    // Decrement stock quantities for purchased products
    for (const item of cart.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
    }

    // Clear cart
    cart.products = [];
    cart.lastUpdated = new Date();
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// GET /api/orders (user's orders or all for admin)
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.userType === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('user', 'name email').populate('products.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/analytics/summary (admin)
router.get('/analytics/summary', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const byStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    res.json({
      totalSales,
      ordersCount: orders.length,
      byStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// PUT /api/orders/:id/status (admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'processing', 'shipped', 'delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;

