const express = require('express');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// 1. HTTP Security Headers (Relaxed CSP for Razorpay and inline scripts)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
            "frame-src": ["'self'", "https://api.razorpay.com", "https://tds.razorpay.com"],
            "connect-src": ["'self'", "https://api.razorpay.com", "https://lumberjack-cx.razorpay.com"],
            "img-src": ["'self'", "data:", "https://*.razorpay.com"]
        },
    },
}));

// 2. CORS configuration
app.use(cors({ origin: ['http://localhost:3000', 'https://framecape.com', 'https://jeeva-1405.github.io'] }));

app.use(express.json());

// 3. Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 10,
    message: { error: "Too many payment requests, please try again later" }
});

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route for index.html to avoid ENOENT issues
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("❌ CRITICAL ERROR: Razorpay credentials missing in .env!");
    process.exit(1);
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint to provide the Razorpay key to the frontend
app.get('/get-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Endpoint to create an order
app.post('/create-order', paymentLimiter, async (req, res) => {
    try {
        const { amount, currency, receipt, description } = req.body;

        // 4. Input Validation
        if (amount === undefined || typeof amount !== 'number' || amount < 1 || amount > 100000) {
            return res.status(400).json({ error: "Invalid amount. Must be between 1 and 100,000." });
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`,
            notes: {
                description: description || "Framecape Payment"
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        // 5. Secure Error Logging (No leaking sensitive details to client)
        console.error("RAZORPAY ORDER CREATION FAILED:", error);
        res.status(500).json({ error: "Order creation failed" });
    }
});

// Endpoint to verify payment signature
app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing required verification fields." });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.json({ status: "Payment Verified", verified: true });
    } else {
        console.warn("⚠️ PAYMENT VERIFICATION ATTEMPT FAILED: Signature mismatch.");
        res.status(400).json({ status: "Payment Verification Failed", verified: false });
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 SECURE SERVER READY: http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ ERROR: Port ${PORT} is already in use.`);
    } else {
        console.error("❌ SERVER ERROR:", err);
    }
    process.exit(1);
});

