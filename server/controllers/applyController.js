import Job from "../models/Job.js";
import Apply from "../models/Apply.js";

export const applyJob = async (req, res) => {
  try {
    const {
      jobId,
      coverLetter,
      bidAmount,
      estimatedDays,

    } = req.body

    if (!jobId || !coverLetter || !bidAmount || !estimatedDays) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      })
    }
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      })
    }
    if (job.status !== "open") {
      return res.status(404).json({
        success: false,
        message: "application is closed",
      })
    }

    const applied = await Apply.findOne({
      job: jobId,
      freelancer: req.userId
    })

    if (applied) {
      return res.status(400).json({
        success: false,
        message: "u cant apply again",
      })
    }

    const apply = await Apply.create({
      job: jobId,
      freelancer: req.userId,
      coverLetter,
      bidAmount,
      estimatedDays,
    })

    return res.status(201).json({
      message: "applied",
      success: true,
      apply,
    })
  } catch (err) {
    console.error("job apply error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getApplyJob = async (req, res) =>{
  try{
    const{jobId} = req.params
    const job = await Job.findById(jobId) 

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      })
    }
    if (job.client.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "you can only view applications for your own job",
      })
    }
    const applied = await Apply.find({job: jobId})
    .populate("freelancer", "name email mobile profileImg bio skills")
    .sort({ createdAt: -1 })

  return res.status(200).json({
      success: true,
      applied,
    })
  } catch (err) {
    console.error("job apply error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const acceptAppliedJob = async (req, res) => {
  try {
    const { applyId } = req.params

    const apply = await Apply.findById(applyId).populate("job")

    if (!apply) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      })
    }

    if (!apply.job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      })
    }

    if (apply.job.client.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "you can only accept applications for your own job",
      })
    }

    if (apply.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "application is already processed",
      })
    }

    if (apply.job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "job is no longer open",
      })
    }

    apply.status = "accepted"
    await apply.save()

    await Apply.updateMany(
      {
        job: apply.job._id,
        _id: { $ne: apply._id },
        status: "pending",
      },
      {
        $set: { status: "rejected" },
      }
    )

    apply.job.status = "in_progress"
    await apply.job.save()

    return res.status(200).json({
      success: true,
      message: "application accepted",
      apply,
    })
  } catch (err) {
    console.error("accept application error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const rejectAppliedJob = async (req, res) => {
  try {
    const { applyId } = req.params

    const apply = await Apply.findById(applyId).populate("job")

    if (!apply) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      })
    }

    if (!apply.job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      })
    }

    if (apply.job.client.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "you can only reject applications for your own job",
      })
    }

    if (apply.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "application is already processed",
      })
    }

    if (apply.job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "job is no longer open",
      })
    }

    apply.status = "rejected"
    await apply.save()

    return res.status(200).json({
      success: true,
      message: "application rejectedted",
      apply,
    })
  } catch (err) {
    console.error("reject application error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getAppliedJob = async (req, res) =>{
  try{
    const applied = await Apply.find({
      freelancer: req.userId
    }) 
    .populate("job", "title budgetType budget deadline status")
    .sort({ createdAt: -1 })

  return res.status(200).json({
      success: true,
      applied,
    })
  } catch (err) {
    console.error("job apply error:", err)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}