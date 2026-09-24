import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 200,
    },

    requiredSkills: {
      type: [String],
      required: true,
    },

    budgetType: {
      type: String,
      enum: ["fixed", "hourly"],
      required: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 1,
    },

    experience: {
      type: String,
      enum: ["beginner", "intermediate", "expert", "any"],
      default: "any",
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;