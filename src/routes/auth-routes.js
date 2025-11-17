import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";


const router = Router();
// mengatur waktu expayet token
const jwtExpiresIn = "1h";
// REGISTER
router.post('/register', async (req, res) => {
  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi!' });
  }

  try {
    const exist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exist.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exist!' });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const result = await pool.query(
      'INSERT INTO users (nickname, email, password) VALUES ($1, $2, $3) RETURNING id, nickname, email',
      [nickname, email, hashed]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const user = result.rows[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGOUT
router.post("/logout", (req, res) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(400).json({ error: "Token tidak ditemukan" });
  }

  // Logout hanya simbolis, tidak perlu verifikasi JWT
  // Frontend tinggal hapus token dari LocalStorage / Session
  res.json({ message: "Logout berhasil — token dihapus di client" });
});

export default router;
