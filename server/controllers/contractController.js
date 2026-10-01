import Apply from "../models/Apply.js"
import Contract from "../models/Contract.js"

export const createContract = async (req, res) => {
    try{
        const {applyId, dealAmount, startDate, endDate} = req.body
        
        if (!applyId || !dealAmount || !startDate || !endDate){
            return res.status(400).json({
                success: false,
                message: "all feilds required",
            })
        }
        
        const apply = await Apply.findById(applyId).populate("job")
        
        if (!apply){
            return res.status(404).json({
                success: false,
                message: "application not found",
            })
        }
        if (!apply.job){
            return res.status(404).json({
                success: false,
                message: "job not found",
            })
        }
        if (apply.job.client.toString() !== req.userId.toString()){
            return res.status(403).json({
                success: false,
                message: "cant create on others job",
            })
        }
        if (apply.status !== "accepted"){
            return res.status(404).json({
                success: false,
                message: "job not accepted found",
            })
        }
        const alreadyContracted = await Contract.findOne({job: apply.job._id}) 
        if (alreadyContracted){
            return res.status(400).json({
                success: false,
                message: "deal already done",
            })
        }
        if (new Date(endDate) <= new Date(startDate)){
            return res.status(400).json({
                success: false,
                message: "end date should be after start date",
            })
        }
        if (Number(dealAmount) <= 0){
            return res.status(400).json({
                success: false,
                message: "amount is invalid",
            })
        }
        
        const contract = await Contract.create({
            job: apply.job._id,
            apply: apply._id,
            client: apply.job.client,
            freelancer: apply.freelancer,
            dealAmount,
            startDate,
            endDate,
        })
        return res.status(201).json({
            success: true,
            message: "contract created",
            contract
        })
    }catch(err){
        console.error("create contract error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const myContract = async (req, res) => {
    try{
        const contracts = await Contract.find({
            $or: [
                {client: req.userId},
                {freelancer: req.userId}
            ]
        })
        .populate("job", "title description budgetType budget deadline status")
        .populate("client", "name email mobile profileImg bio")
        .populate("freelancer", "name email mobile profileImg bio skills")
        .sort({createdAt: -1})

        return res.status(200).json({
            success: true,
            contracts
        })
    }catch(err){
        console.log("fetch error", err);
        
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const myContractById = async (req, res) => {
    try{
        const { contractId } = req.params
        const contract = await Contract.findById(contractId)
        .populate("job", "title description budgetType budget deadline status")
        .populate("client", "name email mobile profileImg bio")
        .populate("freelancer", "name email mobile profileImg bio skills")
        .sort({createdAt: -1})
        if (!contract){
            return res.status(404).json({
                success: false,
                message: "contract not found",
            })
        }

        const isClient = contract.client._id.toString() === req.userId.toString()
        const isFreelancer = contract.freelancer._id.toString() === req.userId.toString()
        if (!isClient && !Freelancer){
            return res.status(404).json({
                success: false,
                message: "its not ur contract",
            })
        }

        return res.status(200).json({
            success: true,
            contract
        })
    }catch(err){
        console.log("fetch error", err);
        
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}