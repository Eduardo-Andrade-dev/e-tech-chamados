import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Criar tabelas se não existirem
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        celular VARCHAR(20),
        cpf_cnpj VARCHAR(20),
        departamento VARCHAR(50),
        cidade VARCHAR(50),
        estado VARCHAR(2) DEFAULT 'PE',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chamados (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        status VARCHAR(50) DEFAULT 'Aberto',
        prioridade VARCHAR(50) DEFAULT 'Média',
        usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Banco de dados sincronizado!');
  } catch (error) {
    console.error('❌ Erro no banco:', error.message);
  }
};
initDb();

// --- ROTAS DE USUÁRIOS ---
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  const { nome, email, celular, cpf_cnpj, departamento, cidade, estado } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, celular, cpf_cnpj, departamento, cidade, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nome, email, celular, cpf_cnpj, departamento, cidade, estado || 'PE']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// --- ROTAS DE CHAMADOS ---
app.get('/api/chamados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.nome as solicitante 
      FROM chamados c 
      LEFT JOIN usuarios u ON c.usuario_id = u.id 
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar chamados' });
  }
});

app.post('/api/chamados', async (req, res) => {
  const { titulo, descricao, prioridade, usuario_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO chamados (titulo, descricao, prioridade, usuario_id, status) 
       VALUES ($1, $2, $3, $4, 'Aberto') RETURNING *`,
      [titulo, descricao, prioridade || 'Média', usuario_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar chamado' });
  }
});

// Nova rota: Atualizar Status do Chamado (Finalizar / Concluir)
app.patch('/api/chamados/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Concluído' ou 'Aberto'
  try {
    const result = await pool.query(
      'UPDATE chamados SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status do chamado' });
  }
});

// Nova rota: Estatísticas para o Painel / Dashboard
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalChamados = await pool.query('SELECT COUNT(*) FROM chamados');
    const chamadosAbertos = await pool.query("SELECT COUNT(*) FROM chamados WHERE status = 'Aberto'");
    const chamadosConcluidos = await pool.query("SELECT COUNT(*) FROM chamados WHERE status = 'Concluído'");
    const totalUsuarios = await pool.query('SELECT COUNT(*) FROM usuarios');

    res.json({
      totalChamados: parseInt(totalChamados.rows[0].count),
      abertos: parseInt(chamadosAbertos.rows[0].count),
      concluidos: parseInt(chamadosConcluidos.rows[0].count),
      totalUsuarios: parseInt(totalUsuarios.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar estatísticas' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});