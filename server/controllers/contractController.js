
import Apply from "../models/Apply.js";
import Contract from "../models/Contract.js";

export const createContract = async (req, res) => {
  try {
    const { applyId, dealAmount, startDate, endDate } = req.body;

    if (!applyId || !dealAmount || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const amount = Number(dealAmount);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid deal amount",
      });
    }

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid contract dates",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const apply = await Apply.findById(applyId).populate("job");

    if (!apply) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (!apply.job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (apply.job.client.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot create a contract for someone else's job",
      });
    }

    if (apply.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "You must accept the application before creating a contract",
      });
    }

    const existingContract = await Contract.findOne({
      $or: [
        { job: apply.job._id },
        { apply: apply._id },
      ],
    });

    if (existingContract) {
      return res.status(400).json({
        success: false,
        message: "A contract already exists for this job or application",
      });
    }

    const contract = await Contract.create({
      job: apply.job._id,
      apply: apply._id,
      client: apply.job.client,
      freelancer: apply.freelancer,
      dealAmount: amount,
      startDate: start,
      endDate: end,
    });

    const populatedContract = await Contract.findById(contract._id)
      .populate("job", "title description budgetType budget deadline status")
      .populate("client", "name email mobile profileImg bio")
      .populate("freelancer", "name email mobile profileImg bio skills");

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      contract: populatedContract,
    });
  } catch (err) {
    console.error("create contract error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A contract already exists for this job or application",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const myContract = async (req, res) => {
  try {
    const contracts = await Contract.find({
      $or: [
        { client: req.userId },
        { freelancer: req.userId },
      ],
    })
      .populate("job", "title description budgetType budget deadline status")
      .populate("client", "name email mobile profileImg bio")
      .populate("freelancer", "name email mobile profileImg bio skills")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      contracts,
    });
  } catch (err) {
    console.error("fetch contracts error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const myContractById = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await Contract.findById(contractId)
      .populate("job", "title description budgetType budget deadline status")
      .populate("client", "name email mobile profileImg bio")
      .populate("freelancer", "name email mobile profileImg bio skills");

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    const isClient =
      contract.client._id.toString() === req.userId.toString();

    const isFreelancer =
      contract.freelancer._id.toString() === req.userId.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this contract",
      });
    }

    return res.status(200).json({
      success: true,
      contract,
    });
  } catch (err) {
    console.error("fetch contract error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
