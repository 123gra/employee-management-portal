const bcrypt = require("bcryptjs");
const db = require("./db");

const hashed = bcrypt.hashSync("admin123", 8);

db.run(
  "INSERT INTO users (email, password) VALUES (?,?)",
  ["admin@test.com", hashed],
  () => {
    console.log("Seed user created");
    process.exit();
  }
);
