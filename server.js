const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(session({
  secret: "job_secret_key",
  resave: false,
  saveUninitialized: true
}));

// DATABASE
const { Pool } = require("pg");

const db = new Pool({
  host: "db.poffjsqulmrqzsgfqxnu.supabase.co",
  user: "postgres",
  password: "Database@1234564",
  database: "postgres",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(() => console.log("Supabase database connected"))
  .catch(err => console.error("Connection error", err));


// ADMIN LOGIN
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (username === "Rajesh" && password === "123456") {
    req.session.admin = true;
    res.json({ ok: true });
  } else res.json({ ok: false });
});

function checkAdmin(req, res, next) {
  if (req.session.admin) next();
  else res.status(401).json({ error: "Unauthorized" });
}

// ADD JOB
app.post("/add-job", checkAdmin, (req, res) => {
  const { title, company, location, salary, description, apply_link, last_date } = req.body;
  const image = req.body.image || "";

  db.query(
    "INSERT INTO jobs(title,company,location,salary,description,apply_link,last_date,image) VALUES (?,?,?,?,?,?,?,?)",
    [title, company, location, salary, description, apply_link, last_date, image],
    () => res.json({ ok: true })
  );
});

// GET JOBS (SHOW TODAY & FUTURE ONLY)
app.get("/jobs", (req, res) => {
  db.query(
    "SELECT * FROM jobs WHERE last_date >= CURDATE() ORDER BY last_date ASC",
    (err, result) => res.json(result)
  );
});

// DELETE
app.delete("/delete-job/:id", checkAdmin, (req, res) => {
  db.query("DELETE FROM jobs WHERE id=?", [req.params.id],
    () => res.json({ ok: true })
  );
});

// UPDATE
app.put("/update-job/:id", checkAdmin, (req, res) => {
  const { title, company, location, salary, description, apply_link, last_date } = req.body;

  db.query(
    "UPDATE jobs SET title=?,company=?,location=?,salary=?,description=?,apply_link=?,last_date=? WHERE id=?",
    [title, company, location, salary, description, apply_link, last_date, req.params.id],
    () => res.json({ ok: true })
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
