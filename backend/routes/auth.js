const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.query("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)", 
            [username, email, hashedPassword, role]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
