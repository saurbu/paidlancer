import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applyRoutes from "./routes/applyRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import workSubmissionRoutes from "./routes/workSubmissionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { handleRazorpayWebhook } from "./controllers/paymentWebhookController.js";

dotenv.config();

const app = express();

const allowedOrigins = [ 
  'http://localhost:5173', 
  'https://paidlancer-saurbu.vercel.app', 
  process.env.FRONTEND_URL 
].filter(Boolean);


app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

app.get("/healthz", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PaidLancer API is running"
    });
});

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    handleRazorpayWebhook
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/work-submissions", workSubmissionRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
