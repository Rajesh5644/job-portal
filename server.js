const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(cors({
  origin: 'https://job-portal99.netlify.app', // allow only your frontend
  credentials: true // if you are using cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(session({
  secret: "job_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,        // only works over HTTPS
    sameSite: "none"     // allows cross-site cookies
  }
}));

// DATABASE
const { Pool } = require("pg");

const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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

  db.query(
    "INSERT INTO jobs(title,company,location,salary,description,apply_link,last_date) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    [title, company, location, salary, description, apply_link, last_date]
  )
    .then(() => res.json({ ok: true }))
    .catch(err => res.json({ error: err }));
});

// GET JOBS (SHOW TODAY & FUTURE ONLY)
app.get("/jobs", (req, res) => {
  db.query(
    "SELECT * FROM jobs WHERE last_date >= CURRENT_DATE ORDER BY last_date ASC"
  )
    .then(result => res.json(result.rows))
    .catch(err => res.json(err));
});

// DELETE
app.delete("/delete-job/:id", checkAdmin, (req, res) => {
  db.query("DELETE FROM jobs WHERE id=$1", [req.params.id])
    .then(() => res.json({ ok: true }))
    .catch(err => res.json(err));
});

// UPDATE
app.put("/update-job/:id", checkAdmin, (req, res) => {
  const { title, company, location, salary, description, apply_link, last_date } = req.body;

  db.query(
    "UPDATE jobs SET title=$1,company=$2,location=$3,salary=$4,description=$5,apply_link=$6,last_date=$7 WHERE id=$8",
    [title, company, location, salary, description, apply_link, last_date, req.params.id]
  )
    .then(() => res.json({ ok: true }))
    .catch(err => res.json(err));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});