import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
    // Configurar search_path para usar solo el esquema public
    options: '--search_path=public'
});

// Crear una función query que envuelva pool.query
export const query = (text, params) => {
  return pool.query(text, params);
};

// Función opcional para verificar conexión
export const connect = async () => {
  const client = await pool.connect();
  client.release();
};

export default pool;