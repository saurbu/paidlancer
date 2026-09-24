import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { acceptAppliedJob, applyJob, getAppliedJob, getApplyJob, rejectAppliedJob } from '../controllers/applyController.js'
import { allowRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post("/", protect, allowRoles("freelancer"), applyJob)
router.patch("/accept/:applyId", protect, allowRoles("client"), acceptAppliedJob)
router.patch("/reject/:applyId", protect, allowRoles("client"), rejectAppliedJob)
router.get("/applied/:jobId", protect, allowRoles("client"), getApplyJob)
router.get("/myapplied", protect, allowRoles("freelancer"), getAppliedJob)

export default router