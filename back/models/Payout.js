const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // the Partner who gets the payout
    },
    referredCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // optional: only set if customer is not the partner
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    commissionPercent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paidDate: {
      type: Date,
    },
    products: [
      {
        productName: String,
        quantity: Number,
        unitPrice: Number,
        productCommission: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
