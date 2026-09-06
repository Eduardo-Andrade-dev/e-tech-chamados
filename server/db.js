import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração da conexão (ajuste com a sua senha/usuário local do Postgres)
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'chamados_db',
  password: process.env.DB_PASSWORD || 'sua_senha_aqui',
  port: process.env.DB_PORT || 5432,
});