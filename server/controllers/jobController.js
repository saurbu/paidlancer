import mongoose from "mongoose";
import Job from "../models/Job.js";

export const jobs = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      budget,
      experience,
      deadline,
    } = req.body

    if (
      !title ||
      !description ||
      !Array.isArray(requiredSkills) ||
      requiredSkills.length === 0 ||
      !budget ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      })
    }

    const job = await Job.create({
      client: req.userId,
      title,
      description,
      requiredSkills,
      budget,
      experience,
      deadline,
    })

    return res.status(201).json({
      message: "job created",
      success: true,
      job,
    })
  } catch (err) {
    console.error("job creation error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("client", "name profileImg")
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.error("Get job error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getJobId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      })
    }

    const job = await Job.findById(req.params.id).populate(
      "client",
      "name profileImg bio"
    )

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      })
    }

    return res.status(200).json({
      success: true,
      job,
    })
  } catch (err) {
    console.error("Get job error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      })
    }

    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      })
    }

    if (job.client.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "cant delete others job",
      })
    }

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "cant delete job",
      })
    }

    await job.deleteOne()

    return res.status(200).json({
      success: true,
      message: "job deleted",
    })
  } catch (err) {
    console.error("job delete error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}