import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
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
          desc: {
            type: String,
          },
          banner: {
            type: String,
          },
          type: {
            type: String,
          },
          unit: {
            type: Number,
          },
          price: {
            type: Number,
          },
          supplier: {
            type: String,
          },
        },
        unit: {
          type: Number,
        },
        _id: false,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
