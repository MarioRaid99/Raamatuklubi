require("dotenv").config();

const bcrypt = require("bcryptjs");
const { db } = require("../db");
const UUID = require("uuid");

async function main() {
  console.log("DB MODELS:", Object.keys(db));

  const Users = db.users; // <-- see peab eksisteerima
  if (!Users) {
    throw new Error("db.users is missing. Check your model registration.");
  }

  const email = process.env.ADMIN_EMAIL || "admin@raamatuklubi.ee";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await Users.findOne({ where: { Email: email } });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);

  const created = await Users.create({
    UserID: UUID.v7(),
    Email: email,
    PasswordHash: hash,
    FirstName: "Admin",
    LastName: "User",
    Role: "ADMIN",
  });

  console.log("Created admin:", created.Email);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
