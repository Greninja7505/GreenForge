import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    stellarAddress: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    bio: String,
    avatar: String,
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["donor", "creator", "both"],
      default: "donor",
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
    stats: {
      totalDonated: {
        type: Number,
        default: 0,
      },
      projectsSupported: {
        type: Number,
        default: 0,
      },
      givTokensEarned: {
        type: Number,
        default: 0,
      },
    },
    social: {
      twitter: String,
      github: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
