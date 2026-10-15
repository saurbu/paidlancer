import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
        required: true,
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkSubmission",
      required: true,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "bank"],
    },
    transactionId: {
        type: String,
        default : ""
    },
    razorpayPaymentId: {
        type: String,
        default: "",
    },
    paidAt:{
        type: Date
    }
  },
  {
    timestamps: true,
  }
)

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment