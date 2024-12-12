import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    items: [
      {
        product: {
          _id: {
            type: Schema.Types.ObjectId,
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
        _id: false,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("Cart", cartSchema);
