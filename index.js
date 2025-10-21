const express = require("express");
let mysql = require("mysql2");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "mahasiswa",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Koneksi Berhasil.");
});

app.get('/api/mahasiswa', (req, res) => {
    db.query("SELECT * FROM biodata", (err, results) => {
        if (err) {
            console.error("Error executing query:" + err.stack);
            res.status(500).send("Error fetching users");
            return;
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req, res) => {
    const {nama, alamat, agama} = req.body;

    if (!nama || !alamat || !agama) {
        return res.status(400).json9({ message : "Nama, alamat, dan agama harus diisi"});
    }

    db.query(
        "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)",
        [nama, alamat, agama],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "database error" });
            }
            res.status(201).json({ message: "user created succesfully"});
        }
    );
});