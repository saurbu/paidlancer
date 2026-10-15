import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const envPath = path.resolve(currentDirectory, "../.env");

dotenv.config({ path: envPath, override: true });

const keyId = process.env.RAZORPAY_KEY_ID?.trim();
const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

console.log("Razorpay key ID loaded:", Boolean(keyId));
console.log("Razorpay secret loaded:", Boolean(keySecret));
console.log("Environment file path:", envPath);

if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials missing. Check server/.env");
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

export default razorpay;