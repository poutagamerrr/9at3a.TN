import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    admin_price: { type: Number, required: true },
    customer_price: { type: Number, required: true },
    vip_customer_price: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    specifications: {
      compatible_models: [{ type: String }],
      color: { type: String },
      other: { type: String },
    },
    stockQuantity: { type: Number, default: 0 },
    pricing: { type: pricingSchema, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

