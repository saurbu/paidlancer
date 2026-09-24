import express from 'express'
import { deleteJob, getJobId, getJobs, jobs } from '../controllers/jobController.js'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'


const router = express.Router()

router.get("/", getJobs)
router.get("/:id", getJobId)  

router.post("/", protect, allowRoles("client"), jobs)
router.delete("/:id", protect, allowRoles("client"), deleteJob)

export default router