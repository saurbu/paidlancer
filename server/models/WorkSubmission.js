import mongoose from "mongoose"

const workSubmissionSchema = new mongoose.Schema(
    {
        contract: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract",
            required: true,
        },
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stage: {
            type: Number,
            enum: [25, 50, 75, 100],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000,
        },
        files: {
            type: [String],
            default: [],
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ["submitted", "paid", "rejected"],
            default: "submitted",
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

const WorkSubmission = mongoose.model(
    "WorkSubmission",
    workSubmissionSchema
)

export default WorkSubmission