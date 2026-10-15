import crypto from "crypto";
import Contract from "../models/Contract.js";
import WorkSubmission from "../models/WorkSubmission.js";
import Payment from "../models/Payment.js";
import razorpay from "../config/razorpay.js";

export const createPayment = async (req, res) => {
    try {
        const { submissionId, paymentMethod } = req.body;

        if (!submissionId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "submissionId and paymentMethod are required",
            });
        }

        if (!["upi", "card", "bank"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }

        const submission = await WorkSubmission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        const contract = await Contract.findById(submission.contract);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Contract not found",
            });
        }

        if (contract.client.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the contract client can pay",
            });
        }

        if (contract.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Contract is not active",
            });
        }

        if (submission.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Submission is already paid",
            });
        }

        // Require the previous milestone to be paid first.
        if (submission.stage > 25) {
            const previousSubmission = await WorkSubmission.findOne({
                contract: contract._id,
                stage: submission.stage - 25,
            });

            if (!previousSubmission || previousSubmission.status !== "paid") {
                return res.status(400).json({
                    success: false,
                    message: "Pay the previous work stage first",
                });
            }
        }

        const existingPayment = await Payment.findOne({
            submission: submission._id,
            status: "success",
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment already completed",
            });
        }

        const amountInPaise = Math.round(submission.amount * 100);

        if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount",
            });
        }

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `submission_${submission._id}`,
            notes: {
                submissionId: submission._id.toString(),
                contractId: contract._id.toString(),
            },
        });

        const payment = await Payment.findOneAndUpdate(
            { submission: submission._id },
            {
                contract: contract._id,
                submission: submission._id,
                client: contract.client,
                freelancer: contract.freelancer,
                amount: submission.amount,
                paymentMethod,
                status: "pending",
                transactionId: order.id,
                razorpayPaymentId: "",
                paidAt: undefined,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return res.status(201).json({
            success: true,
            message: "Razorpay order created; payment is pending",
            keyId: process.env.RAZORPAY_KEY_ID,
            order,
            payment,
        });
    } catch (err) {
        console.error("Create payment error:", err);

        return res.status(500).json({
            success: false,
            message: "Could not create payment order",
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            submissionId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !submissionId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment verification fields",
            });
        }

        // A SHA-256 HMAC signature must be 64 hexadecimal characters.
        if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature format",
            });
        }

        const submission = await WorkSubmission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        const contract = await Contract.findById(submission.contract);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Contract not found",
            });
        }

        if (contract.client.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the contract client can verify this payment",
            });
        }

        const payment = await Payment.findOne({
            submission: submission._id,
            contract: contract._id,
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found. Create an order first.",
            });
        }

        // The order returned by Razorpay must match our saved order.
        if (payment.transactionId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order does not match this submission",
            });
        }

        if (Number(payment.amount) !== Number(submission.amount)) {
            return res.status(400).json({
                success: false,
                message: "Payment amount does not match the submission",
            });
        }

        // Verify using the secret key on the server only.
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(razorpay_signature, "hex");

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed",
            });
        }

        // Idempotency: repeated verification must not pay the milestone twice.
        if (payment.status === "success" && submission.status === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment was already verified",
                payment,
                submission,
            });
        }

        if (payment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This payment is not pending",
            });
        }

        if (submission.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Submission is already marked as paid",
            });
        }

        payment.status = "success";
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.paidAt = new Date();
        await payment.save();

        submission.status = "paid";
        submission.paidAt = new Date();
        await submission.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified and work stage marked as paid",
            payment,
            submission,
        });
    } catch (err) {
        console.error("Verify payment error:", err);

        return res.status(500).json({
            success: false,
            message: "Could not verify payment",
        });
    }
};