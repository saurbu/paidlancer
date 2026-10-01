import express from 'express'

import { getSubmittedWork, submitWork } from "../controllers/workSubmissionController.js"
import { protect } from "../middleware/authMiddleware.js"
import { allowRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.post("/", protect, allowRoles("freelancer"), submitWork)
router.post("/contract/:contractId", protect, allowRoles("freelancer", "client"), getSubmittedWork)

export default router 