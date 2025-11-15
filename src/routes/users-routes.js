import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users ORDER BY id ASC");
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



export default router;
