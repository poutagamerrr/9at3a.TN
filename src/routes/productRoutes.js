import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const computeVisiblePrice = (product, userType) => {
  if (!product.pricing) return null;
  if (userType === 'admin') return product.pricing.admin_price;
  if (userType === 'vip_customer') return product.pricing.vip_customer_price;
  return product.pricing.customer_price;
};

// GET /api/products
router.get('/', optionalAuth, async (req, res) => {
  try {
    const products = await Product.find({});
    const userType = req.user?.userType || 'customer';

    const data = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      description: p.description,
      images: p.images,
      specifications: p.specifications,
      stockQuantity: p.stockQuantity,
      price: computeVisiblePrice(p, userType),
      pricing: userType === 'admin' ? p.pricing : undefined,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const userType = req.user?.userType || 'customer';
    res.json({
      id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      images: product.images,
      specifications: product.specifications,
      stockQuantity: product.stockQuantity,
      price: computeVisiblePrice(product, userType),
      pricing: userType === 'admin' ? product.pricing : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// POST /api/products (admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').notEmpty(),
    body('category').notEmpty(),
    body('pricing.admin_price').isNumeric(),
    body('pricing.customer_price').isNumeric(),
    body('pricing.vip_customer_price').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create product' });
    }
  }
);

// PUT /api/products/:id (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;

