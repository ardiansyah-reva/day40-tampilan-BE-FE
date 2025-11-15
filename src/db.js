import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`Database connected at: ${result.rows[0].now}`);
  } catch (err) {
    console.error(' Database connection error:', err.message);
  }
}