const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

function cleanEmail(value = "") {
  return String(value).trim().toLowerCase();
}

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = cleanEmail(req.body.email);
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");

    if (name.length < 3) {
      return res.status(400).json({ success: false, message: "Name must be at least 3 characters." });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone number must be exactly 10 digits." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1",
      [email, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: "Email or phone number is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, phone, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful. You can now log in.",
      user: {
        id: result.insertId,
        name,
        email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error while creating account." });
  }
};

exports.login = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const [users] = await db.query(
      "SELECT id, name, email, phone, password_hash, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error while logging in." });
  }
};

exports.me = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User account not found." });
    }

    return res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ success: false, message: "Server error while loading profile." });
  }
};

// Demo academic reset flow. For production, use an emailed OTP/token before allowing password reset.
exports.resetPassword = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const newPassword = String(req.body.newPassword || "");

    if (!email) {
      return res.status(400).json({ success: false, message: "Registered email is required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const [users] = await db.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "This email is not registered." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, users[0].id]);

    return res.json({ success: true, message: "Password reset successful. Please log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Server error while resetting password." });
  }
};
