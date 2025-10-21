const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Wyvernoid1925",
  database: "mahasiswa",
  port: 3309,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Koneksi ke database berhasil.");
});

// Route dasar
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET: ambil semua data mahasiswa
app.get("/api/mahasiswa", (req, res) => {
  db.query("SELECT * FROM biodata", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      return res.status(500).send("Error fetching users");
    }
    res.json(results);
  });
});

// POST: tambah mahasiswa baru
app.post("/api/mahasiswa", (req, res) => {
  const { nama, alamat, agama } = req.body;

  if (!nama || !alamat || !agama) {
    return res.status(400).json({ message: "Nama, alamat, dan agama harus diisi" });
  }

  db.query(
    "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)",
    [nama, alamat, agama],
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

// PUT: update data mahasiswa
app.put("/api/mahasiswa/:id", (req, res) => {
  const { id } = req.params;
  const { nama, alamat, agama } = req.body;

  db.query(
    "UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id = ?",
    [nama, alamat, agama, id],
    (err, results) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// DELETE: hapus data mahasiswa
app.delete("/api/mahasiswa/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM biodata WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
