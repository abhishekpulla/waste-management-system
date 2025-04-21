const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("./models");
const { authenticateToken, authorizeRole } = require("./authMiddleware");
require("dotenv").config();

const router = express.Router();
const otpStorage = {}; // Temporary storage for OTPs

// ✅ Send OTP (Expires in 30 seconds)
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = Date.now() + 30000; // 30 seconds expiration

    otpStorage[email] = { otp, expiresAt: expirationTime };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Waste Management System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code for Verification",
        html: `
            <p>Hello,</p>
            <p><strong>Your OTP for signup is: <span style="color:blue;">${otp}</span></strong></p>
            <p>This OTP will expire in <strong>30 seconds</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,<br>Waste Management Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: `OTP sent to ${email}` });

        // Automatically delete OTP after 30 seconds
        setTimeout(() => delete otpStorage[email], 30000);
    } catch (error) {
        res.status(500).json({ error: "Error sending OTP" });
    }
});

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, otp, password, confirmPassword } = req.body;

    if (!otpStorage[email]) return res.status(400).json({ error: "OTP expired or not found" });

    const { otp: storedOtp, expiresAt } = otpStorage[email];

    if (Date.now() > expiresAt) {
        delete otpStorage[email];
        return res.status(400).json({ error: "OTP has expired. Request a new one." });
    }

    if (storedOtp !== parseInt(otp)) return res.status(400).json({ error: "Invalid OTP" });

    if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, role: "user" });

        await newUser.save();
        delete otpStorage[email];
        res.status(201).json({ success: true, message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, email: user.email, role: user.role });
});

// ✅ Protected Profile Route
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ message: "User profile loaded", user });
    } catch (error) {
        res.status(500).json({ error: "Error loading profile" });
    }
});

// ✅ Admin Route
router.get("/admin", authenticateToken, authorizeRole("admin"), async (req, res) => {
    res.json({ message: "Welcome, Admin!", adminData: "Some admin-specific data" });
});

module.exports = router; // ✅ This line ensures `router` is correctly exported
