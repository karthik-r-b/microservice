import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  unit: {
    type: Number,
  },
  price: {
    type: Number,
  },
  available: {
    type: Boolean,
  },
  supplier: {
    type: String,
  },
});

export default mongoose.model("product", productSchema);
