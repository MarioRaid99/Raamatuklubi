const { db } = require("../db");

exports.getMe = async (req, res) => {
  const { UserID } = req.user;
  const user = await db.users.findByPk(UserID, {
    attributes: ["UserID", "Email", "First_name", "Last_name", "Phone_number", "Role", "createdAt", "updatedAt"],
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.status(200).json(user);
};

exports.updateMe = async (req, res) => {
  const { UserID } = req.user;
  const user = await db.users.findByPk(UserID);
  if (!user) return res.status(404).json({ error: "User not found" });

  const allowed = ["First_name", "Last_name", "Phone_number"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  await user.update(updates);
  return res.status(200).json({
    UserID: user.UserID,
    Email: user.Email,
    First_name: user.First_name,
    Last_name: user.Last_name,
    Phone_number: user.Phone_number,
    Role: user.Role,
  });
};

// ADMIN: list users
exports.getAll = async (req, res) => {
  const users = await db.users.findAll({
    attributes: ["UserID", "Email", "First_name", "Last_name", "Phone_number", "Role", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json(users);
};
