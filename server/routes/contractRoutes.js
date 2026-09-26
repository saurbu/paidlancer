import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/roleMiddleware.js'
import { createContract } from '../controllers/contractController.js'

const router = express.Router()

router.post("/", protect, allowRoles("client"), createContract)

export default router