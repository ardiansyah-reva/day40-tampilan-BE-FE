import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nickname, email FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const ID = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [ID]);
    const userData = result.rows[0];

    if (!userData) {
      return res.status(404).json({
        code: 404,
        message: `id ${ID} not found`,
      });
    }
    res.json({
      data: userData,
      message: "sukses",
    });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ngedit data user
router.put("/:id", async (req, res) => {
  const ID = parseInt(req.params.id);
  const { full_name, nickname, email, phone, address, image, birthday } = req.body;

  try {
    
    const check = await pool.query("SELECT * FROM users WHERE id = $1", [ID]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: `User dengan id ${ID} tidak ditemukan`
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET full_name = $1,
           nickname = $2,
           email = $3,
           phone = $4,
           address = $5,
           image = $6,
           birthday = $7,
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [full_name, nickname, email, phone, address, image, birthday, ID]
    );

    res.json({
      code: 200,
      message: "User berhasil diperbarui",
      data: result.rows[0]
    });

  } catch (err) {
    console.error(" Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// menghapus data user
router.delete("/:id", async (req, res) => {
  const ID = parseInt(req.params.id);

  try {
    // cek data user dengan ID itu ada apa kaga
    const check = await pool.query("SELECT * FROM users WHERE id = $1", [ID]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: `user dengan id ${ID} tidak ditemukan`
      });
    }

    // Hapus user dari database
    await pool.query("DELETE FROM users WHERE id = $1", [ID]);

    //  Kirim respons sukses
    res.json({
      code: 200,
      message: `user dengan id ${ID} berhasil dihapus`
    });

  } catch (err) {
    console.error(" Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



export default router;
