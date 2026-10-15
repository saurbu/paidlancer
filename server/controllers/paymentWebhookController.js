import crypto from "crypto";
import Payment from "../models/Payment.js";
import WorkSubmission from "../models/WorkSubmission.js";

export const handleRazorpayWebhook = async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
        return res.status(500).json({ message: "Webhook is not configured" });
    }

    const signature = req.headers["x-razorpay-signature"];

    if (!signature || !Buffer.isBuffer(req.body)) {
        return res.status(400).json({ message: "Invalid webhook request" });
    }

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    let received;

    if (!/^[a-f0-9]{64}$/i.test(signature)) {
        return res.status(400).json({ message: "Invalid webhook signature" });
    }

    received = Buffer.from(signature, "hex");

    if (
        expected.length !== received.length ||
        !crypto.timingSafeEqual(expected, received)
    ) {
        return res.status(400).json({ message: "Invalid webhook signature" });
    }

    try {
        const event = JSON.parse(req.body.toString("utf8"));

        if (event.event === "payment.captured") {
            const razorpayPayment = event.payload?.payment?.entity;
            const orderId = razorpayPayment?.order_id;
            const paymentId = razorpayPayment?.id;

            if (!orderId || !paymentId) {
                return res.status(400).json({ message: "Missing payment details" });
            }

            const payment = await Payment.findOne({ transactionId: orderId });

            if (!payment) {
                // Acknowledge unknown orders to avoid endless retries;
                // retain logs for investigation.
                console.warn("Captured Razorpay order not found:", orderId);
                return res.status(200).json({ received: true });
            }

            // Verify the captured amount and currency against our saved record.
            if (
                Number(razorpayPayment.amount) !== Math.round(payment.amount * 100) ||
                razorpayPayment.currency !== "INR"
            ) {
                console.error("Captured payment amount/currency mismatch:", orderId);
                return res.status(400).json({ message: "Payment amount mismatch" });
            }

            if (payment.status !== "success") {
                const submission = await WorkSubmission.findById(payment.submission);

                if (!submission) {
                    console.error("Submission not found for payment:", payment._id);
                    return res.status(200).json({ received: true });
                }

                payment.status = "success";
                payment.razorpayPaymentId = paymentId;
                payment.paidAt = new Date();
                await payment.save();

                submission.status = "paid";
                submission.paidAt = new Date();
                await submission.save();
            }
        }

        if (event.event === "payment.failed") {
            const failedPayment = event.payload?.payment?.entity;
            const orderId = failedPayment?.order_id;

            if (orderId) {
                const payment = await Payment.findOne({ transactionId: orderId });

                // Do not overwrite a payment already confirmed as successful.
                if (payment && payment.status === "pending") {
                    payment.status = "failed";
                    payment.razorpayPaymentId = failedPayment.id || "";
                    await payment.save();
                }
            }
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error("Razorpay webhook error:", err);
        return res.status(500).json({ message: "Webhook processing failed" });
    }
};