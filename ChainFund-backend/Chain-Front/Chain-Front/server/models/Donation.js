import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    donor: {
      stellarAddress: {
        type: String,
        required: true,
      },
      anonymous: {
        type: Boolean,
        default: false,
      },
    },
    amount: {
      type: Number,
      required: true,
    },
    asset: {
      type: String,
      default: "XLM",
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    memo: String,
    platformFee: {
      type: Number,
      default: 0,
    },
    givbacksAmount: {
      type: Number,
      default: 0,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
donationSchema.index({ project: 1, createdAt: -1 });
donationSchema.index({ "donor.stellarAddress": 1 });
donationSchema.index({ transactionHash: 1 });

export default mongoose.model("Donation", donationSchema);
