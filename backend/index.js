require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200, 
  })
);

app.use(express.json());
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.id;
    next();
  });
};

db.get("SELECT * FROM users", (err, row) => {
  if (!row) {
    const hashedPassword = bcrypt.hashSync("admin123", 8);
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      ["admin@test.com", hashedPassword],
      () => console.log("Default admin user seeded")
    );
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  });
});

app.get("/employees", auth, (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/employees", auth, (req, res) => {
  const { name, role, department } = req.body;
  db.run(
    "INSERT INTO employees (name, role, department) VALUES (?, ?, ?)",
    [name, role, department],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

app.put("/employees/:id", auth, (req, res) => {
  const { name, role, department } = req.body;
  db.run(
    "UPDATE employees SET name = ?, role = ?, department = ? WHERE id = ?",
    [name, role, department, req.params.id],
    () => res.sendStatus(200)
  );
});

app.delete("/employees/:id", auth, (req, res) => {
  db.run("DELETE FROM employees WHERE id = ?", [req.params.id], () =>
    res.sendStatus(200)
  );
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
