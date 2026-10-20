
import express from "express";
import {
    createPayment,
    verifyPayment,
    getMyPayments,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("client"), getMyPayments);
router.post("/", protect, allowRoles("client"), createPayment);
router.post("/verify", protect, allowRoles("client"), verifyPayment);

export default router;
