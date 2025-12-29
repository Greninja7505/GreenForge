import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "environment",
        "education",
        "health",
        "agriculture",
        "art",
        "technology",
        "community",
      ],
    },
    creator: {
      name: String,
      stellarAddress: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    goal: {
      type: Number,
      required: true,
    },
    raised: {
      type: Number,
      default: 0,
    },
    donors: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    givbacksEligible: {
      type: Boolean,
      default: false,
    },
    location: String,
    website: String,
    social: {
      twitter: String,
      github: String,
      discord: String,
    },
    images: [String],
    updates: [
      {
        title: String,
        content: String,
        author: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
projectSchema.index({ title: "text", description: "text" });

export default mongoose.model("Project", projectSchema);
