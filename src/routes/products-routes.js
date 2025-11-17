import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows); 
  } catch (err) {
    console.error('❌ Database error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  const ID = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [ID]);  
    const productData = result.rows[0];
    
    if(!productData){
        return res.status(404).json({
            code: 404,
            message: `id ${ID} not found`
        })
    }
   res.json({
        data: productData,
        message: "sukses"
    });
  } catch (err) {
    console.error(" Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// nambahin data produk
router.post("/", async (req, res) => {
  const { name, category, brand, description, price, stock, rating, media } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products 
      (name, category, brand, description, price, stock, rating, media)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, category, brand, description, price, stock, rating, JSON.stringify(media)] // media disimpan sebagai JSON
    );

    return res.status(201).json({
      message: " Produk berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(" Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const ID = parseInt(req.params.id);
  const { name, category, brand, description, price, stock, rating } = req.body;

  try {
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [ID]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: `Produk dengan id ${ID} tidak ditemukan`
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1, category = $2, brand = $3, description = $4,
           price = $5, stock = $6, rating = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [name, category, brand, description, price, stock, rating, ID]
    );
    res.json({
      code: 200,
      message: "Produk berhasil diperbarui",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  const ID = parseInt(req.params.id);

  try {
    // cek data produk dengan ID itu ada apa kaga
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [ID]);
    if (check.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: `Produk dengan id ${ID} tidak ditemukan`
      });
    }

    // Hapus produk dari database
    await pool.query("DELETE FROM products WHERE id = $1", [ID]);

    //  Kirim respons sukses
    res.json({
      code: 200,
      message: `Produk dengan id ${ID} berhasil dihapus`
    });

  } catch (err) {
    console.error(" Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
