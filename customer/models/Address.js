import mongoose from "mongoose";

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    street: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("address", addressSchema);
