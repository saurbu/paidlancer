
import "dotenv/config";
import crypto from "node:crypto";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!webhookSecret) {
    console.error("Missing RAZORPAY_WEBHOOK_SECRET in server/.env");
    process.exit(1);
}

const payload = {
    entity: "event",
    account_id: "test_account",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
        payment: {
            entity: {
                id: "pay_synthetic_webhook_test",
                entity: "payment",
                amount: 1500000,
                currency: "INR",
                status: "captured",
                order_id: "order_synthetic_unknown_test"
            }
        }
    },
    created_at: Math.floor(Date.now() / 1000)
};

const rawBody = JSON.stringify(payload);

const signature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

try {
    const response = await fetch(
        "https://batboy-unlaced-lion.ngrok-free.dev/api/payments/webhook",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-razorpay-signature": signature
            },
            body: rawBody
        }
    );

    console.log("HTTP status:", response.status);
    console.log("Response:", await response.text());
} catch (error) {
    console.error("Request failed:", error.message);
}
