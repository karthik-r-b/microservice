import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    name: {
      type: String,
    },
    salt: {
      type: String,
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
    ],
    cart: [
      {
        product: {
          _id: {
            type: String,
          },
          name: {
            type: String,
          },
          banner: {
            type: String,
          },
          price: {
            type: Number,
          },
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    wishlist: [
      {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        description: { type: String },
        banner: { type: String },
        available: { type: Boolean },
        price: { type: Number },
      },
    ],
    orders: [
      {
        _id: { type: String, required: true },
        amount: { type: String },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("customer", customerSchema);
