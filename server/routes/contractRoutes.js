import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'
import { createContract, myContract, myContractById } from '../controllers/contractController.js'

const router = express.Router()

router.post("/", protect, allowRoles("client"), createContract)
router.get("/my", protect, allowRoles("client", "freelancer"), myContract)
router.get("/:contractId", protect, allowRoles("client", "freelancer"), myContractById)

export default router