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