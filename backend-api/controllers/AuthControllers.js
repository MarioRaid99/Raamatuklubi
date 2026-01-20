const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v7: uuidv7 } = require("uuid");
const { db } = require("../db");

function signToken(user) {
  return jwt.sign(
    { UserID: user.UserID, Email: user.Email, Role: user.Role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.register = async (req, res) => {
  try {
    const { Email, Password, First_name, Last_name, Phone_number } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const existing = await db.users.findOne({ where: { Email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(Password, 10);

    const created = await db.users.create({
      UserID: uuidv7(),
      Email,
      PasswordHash: hash,
      First_name: First_name || null,
      Last_name: Last_name || null,
      Phone_number: Phone_number ?? null,
      Role: "USER",
    });

    const token = signToken(created);

    return res.status(201).json({
      token,
      user: { UserID: created.UserID, Email: created.Email, Role: created.Role },
    });
  } catch (err) {
    return res.status(400).json({ error: "Failed to register", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await db.users.findOne({ where: { Email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(Password, user.PasswordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: { UserID: user.UserID, Email: user.Email, Role: user.Role },
    });
  } catch (err) {
    return res.status(400).json({ error: "Failed to login", details: err.message });
  }
};
