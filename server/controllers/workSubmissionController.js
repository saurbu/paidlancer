import Contract from "../models/Contract.js"
import WorkSubmission from "../models/WorkSubmission.js"

export const submitWork = async (req, res) => {
    try {
        const {
            contractId,
            stage,
            description,
            files
        } = req.body

        if (!contractId || !stage || !description) {
            return res.status(400).json({
                success: false,
                message: "all fields required",
            })
        }

        if (![25, 50, 75, 100].includes(Number(stage))) {
            return res.status(400).json({
                success: false,
                message: "invalid stage",
            })
        }

        const contract = await Contract.findById(contractId)

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "contract not found",
            })
        }

        if (contract.freelancer.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "only contract freelancer can submit work",
            })
        }

        if (contract.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "contract is not active",
            })
        }

        const existingSubmission = await WorkSubmission.findOne({
            contract: contractId,
            stage: Number(stage),
        })

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: "this stage has already been submitted",
            })
        }

        const previousStage = Number(stage) - 25

        if (previousStage > 0) {
            const previousSubmission = await WorkSubmission.findOne({
                contract: contractId,
                stage: previousStage,
                status: "paid",
            })

            if (!previousSubmission) {
                return res.status(400).json({
                    success: false,
                    message: "previous stage must be completed first",
                })
            }
        }

        const amount = contract.dealAmount / 4

        const submission = await WorkSubmission.create({
            contract: contractId,
            freelancer: req.userId,
            stage: Number(stage),
            description,
            files: Array.isArray(files) ? files : [],
            amount,
        })

        return res.status(201).json({
            success: true,
            message: "work submitted",
            submission,
        })
    } catch (err) {
        console.error("submit work error:", err)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const getSubmittedWork = async (req, res) => {
    try{
        const {contractId} = req.params
        const contract =  await Contract.findById(contractId)
        if (!contract){
            return res.status(400).json({
                success: false,
                message: "contract not found",
            })
        }
        
        const isClient = Contract.client.toString() === req.userId.toString()
        const isFreelancer = Contract.freelancer.toString() === req.userId.toString()

        if (!isFreelancer || !isClient) {
            return res.status(400).json({
                success: false,
                message: "u can only view ur work", 
            })
        }
        const submissions = await WorkSubmission.find({contract: contractId})
        .populate("freelancer", "name email profileimg bio"  )
        .sort({stage: 1})

        return res.status(200).json({
            success: true,
            message: "works",
            submissions,
        })
    } catch (err) {
        console.error("work find error:", err)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}