const express = require("express");
const bcrypt = require("bcrypt"); // Ensure password hashing
const { connectDB, // ✅ Export connectDB properly
    insertUser,
    getUsers,
    updateUsers,
    deleteUser,
    ObjectId, } = require("./Users.js"); // Import connectDB function

const router = express.Router();

// ✅ User Registration Route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const db = await connectDB();
        const collection = db.collection("Users");

        // Check if email already exists
        const existingUser = await collection.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        await collection.insertOne({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = await connectDB();
        const collection = db.collection("Users");

        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error("❌ Error logging in:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const db = await connectDB();
        console.log("✅ Database connected"); // Debugging step
        const collection = db.collection("Users");

        const user = await collection.findOne({ email });

        if (!user) {
            console.log("❌ User not found"); // Debugging
            return res.status(404).json({ message: "User not found" });
        }

        console.log("🔑 User found, hashing new password..."); // Debugging
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await collection.updateOne({ email }, { $set: { password: hashedPassword } });

        console.log("✅ Password updated successfully"); // Debugging
        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("❌ Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const db = await connectDB();  // Ensure database connection
        const collection = db.collection("Users"); // Get the Users collection

        // Find the user in MongoDB
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await collection.updateOne({ email }, { $set: { password: hashedPassword } });

        console.log("✅ Password updated successfully");
        return res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("❌ Error updating password:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});




// ✅ Check Email Route
router.post("/check-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        console.log("Received email:", email);

        const db = await connectDB();
        const collection = db.collection("Users");

        const user = await collection.findOne({ email });

        if (user) {
            return res.json({ exists: true });
        } else {
            return res.status(404).json({ error: "Email not found." });
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Server error while checking email." });
    }
});



// ✅ Route for adding a user
router.post("/add", async (req, res) => {
    try {
        await insertUser(req.body);
        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Route for getting all users
router.get("/users", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Route for updating user
router.put("/update", async (req, res) => {
    try {
        const { email, password, newData } = req.body;
        await updateUsers(email, password, newData);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Route for deleting user
router.delete("/delete", async (req, res) => {
    try {
        const { email, password } = req.body;
        await deleteUser(email, password);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;



