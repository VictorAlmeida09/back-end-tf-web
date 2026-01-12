import pkg from "pg";
import dotenv from "dotenv";
import express from "express";      // Requisição do pacote do express

// ######
// Local onde as configurações do servidor serão feitas
// ######
const app = express();              // Instancia o Express
const port = 3000;                  // Define a porta
dotenv.config();         // Carrega e processa o arquivo .env
const { Pool } = pkg;    // Utiliza a Classe Pool do Postgres
const db = conectarBD();
// ######
// Local onde as rotas (endpoints) serão definidas
// ######
app.get("/", async (req, res) => {
    const db = new Pool({
        connectionString: process.env.URL_BD,
    });

    let dbStatus = "ok";
    try {
        await db.query("SELECT 1");
    } catch (e) {
        dbStatus = e.message;
    }
    // Rota raiz do servidor
    // Rota GET /
    // Esta rota é chamada quando o usuário acessa a raiz do servidor
    // Ela retorna uma mensagem com informações do projeto

    console.log("Rota GET / solicitada"); // Log no terminal para indicar que a rota foi acessada

    // Responde com um JSON contendo uma mensagem
    res.json({
    });
});


// Rota: GET /usuarios
app.get("/usuarios", async (req, res) => {
  console.log("Rota GET /usuarios solicitada");
  try {
    const db = conectarBD();
    const resultado = await db.query(`
      SELECT id, name, email, contact, photo_url, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(resultado.rows);
  } catch (e) {
    console.error("Erro ao buscar usuários:", e);
    res.status(500).json({ erro: "Erro interno ao buscar usuários" });
  }
});

// Rota: GET /usuarios/:id
app.get("/usuarios/:id", async (req, res) => {
  console.log("Rota GET /usuarios/:id solicitada");
  try {
    const id = Number(req.params.id);
    const db = conectarBD();

    const usuario = await db.query(
      "SELECT id, name, email, contact, photo_url, created_at FROM users WHERE id = $1",
      [id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Buscar habilidades oferecidas
    const offered = await db.query(`
      SELECT s.name AS skill_name, os.level, os.description
      FROM offered_skills os
      JOIN skills s ON s.id = os.skill_id
      WHERE os.user_id = $1
    `, [id]);

    // Buscar habilidades desejadas
    const wanted = await db.query(`
      SELECT s.name AS skill_name, ws.level, ws.description
      FROM wanted_skills ws
      JOIN skills s ON s.id = ws.skill_id
      WHERE ws.user_id = $1
    `, [id]);

    res.json({
      ...usuario.rows[0],
      skillsOffered: offered.rows,
      skillsWanted: wanted.rows
    });
  } catch (e) {
    console.error("Erro ao buscar usuário:", e);
    res.status(500).json({ erro: "Erro interno ao buscar usuário" });
  }
});

// Rota: POST /usuarios
app.post("/usuarios", async (req, res) => {
  console.log("Rota POST /usuarios solicitada");
  try {
    const { name, email, password, contact, photo_url } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios" });
    }

    const db = conectarBD();

    // Verificar se e-mail já existe
    const existe = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    // Simples (em produção, use bcrypt!)
    const resultado = await db.query(`
      INSERT INTO users (name, email, password_hash, contact, photo_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, contact, photo_url, created_at
    `, [name, email, password, contact, photo_url]);

    res.status(201).json(resultado.rows[0]);
  } catch (e) {
    console.error("Erro ao criar usuário:", e);
    res.status(500).json({ erro: "Erro interno ao criar usuário" });
  }
});

// Rota: PUT /usuarios/:id
app.put("/usuarios/:id", async (req, res) => {
  console.log("Rota PUT /usuarios/:id solicitada");
  try {
    const id = Number(req.params.id);
    const { name, email, contact, photo_url } = req.body;
    const db = conectarBD();

    const atual = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const u = atual.rows[0];
    await db.query(`
      UPDATE users SET
        name = $1,
        email = $2,
        contact = $3,
        photo_url = $4,
        updated_at = NOW()
      WHERE id = $5
    `, [
      name ?? u.name,
      email ?? u.email,
      contact ?? u.contact,
      photo_url ?? u.photo_url,
      id
    ]);

    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (e) {
    console.error("Erro ao atualizar usuário:", e);
    res.status(500).json({ erro: "Erro interno ao atualizar usuário" });
  }
});

// Rota: DELETE /usuarios/:id
app.delete("/usuarios/:id", async (req, res) => {
  console.log("Rota DELETE /usuarios/:id solicitada");
  try {
    const id = Number(req.params.id);
    const db = conectarBD();

    const resultado = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário excluído com sucesso!" });
  } catch (e) {
    console.error("Erro ao excluir usuário:", e);
    res.status(500).json({ erro: "Erro interno ao excluir usuário" });
  }
});

// Rota: POST /usuarios/:id/skills/offered
app.post("/usuarios/:id/skills/offered", async (req, res) => {
  console.log("Rota POST /usuarios/:id/skills/offered solicitada");
  try {
    const userId = Number(req.params.id);
    const { skill_name, level, description } = req.body;

    if (!skill_name || !level) {
      return res.status(400).json({ erro: "Nome da habilidade e nível são obrigatórios" });
    }

    const db = conectarBD();

    // Verifica se usuário existe
    const userExists = await db.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Garante que a skill está no catálogo
    let skill = await db.query("SELECT id FROM skills WHERE name = $1", [skill_name]);
    if (skill.rows.length === 0) {
      const novaSkill = await db.query(
        "INSERT INTO skills (name) VALUES ($1) RETURNING id",
        [skill_name]
      );
      skill = { rows: [{ id: novaSkill.rows[0].id }] };
    }

    await db.query(`
      INSERT INTO offered_skills (user_id, skill_id, level, description)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, skill_id) DO UPDATE
      SET level = $3, description = $4
    `, [userId, skill.rows[0].id, level, description]);

    res.status(201).json({ mensagem: "Habilidade oferecida adicionada/atualizada com sucesso!" });
  } catch (e) {
    console.error("Erro ao adicionar habilidade oferecida:", e);
    res.status(500).json({ erro: "Erro interno ao adicionar habilidade oferecida" });
  }
});

// Rota: DELETE /usuarios/:id/skills/offered/:skillName
app.delete("/usuarios/:id/skills/offered/:skillName", async (req, res) => {
  console.log("Rota DELETE /usuarios/:id/skills/offered/:skillName solicitada");
  try {
    const userId = Number(req.params.id);
    const skillName = req.params.skillName;
    const db = conectarBD();

    const skill = await db.query("SELECT id FROM skills WHERE name = $1", [skillName]);
    if (skill.rows.length === 0) {
      return res.status(404).json({ erro: "Habilidade não encontrada" });
    }

    const result = await db.query(`
      DELETE FROM offered_skills
      WHERE user_id = $1 AND skill_id = $2
      RETURNING *
    `, [userId, skill.rows[0].id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Habilidade oferecida não encontrada para este usuário" });
    }

    res.json({ mensagem: "Habilidade oferecida removida com sucesso!" });
  } catch (e) {
    console.error("Erro ao remover habilidade oferecida:", e);
    res.status(500).json({ erro: "Erro interno ao remover habilidade oferecida" });
  }
});

// Rota: POST /usuarios/:id/skills/wanted
app.post("/usuarios/:id/skills/wanted", async (req, res) => {
  console.log("Rota POST /usuarios/:id/skills/wanted solicitada");
  try {
    const userId = Number(req.params.id);
    const { skill_name, level, description } = req.body;

    if (!skill_name || !level) {
      return res.status(400).json({ erro: "Nome da habilidade e nível são obrigatórios" });
    }

    const db = conectarBD();

    const userExists = await db.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    let skill = await db.query("SELECT id FROM skills WHERE name = $1", [skill_name]);
    if (skill.rows.length === 0) {
      const novaSkill = await db.query(
        "INSERT INTO skills (name) VALUES ($1) RETURNING id",
        [skill_name]
      );
      skill = { rows: [{ id: novaSkill.rows[0].id }] };
    }

    await db.query(`
      INSERT INTO wanted_skills (user_id, skill_id, level, description)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, skill_id) DO UPDATE
      SET level = $3, description = $4
    `, [userId, skill.rows[0].id, level, description]);

    res.status(201).json({ mensagem: "Habilidade desejada adicionada/atualizada com sucesso!" });
  } catch (e) {
    console.error("Erro ao adicionar habilidade desejada:", e);
    res.status(500).json({ erro: "Erro interno ao adicionar habilidade desejada" });
  }
});

// Rota: DELETE /usuarios/:id/skills/wanted/:skillName
app.delete("/usuarios/:id/skills/wanted/:skillName", async (req, res) => {
  console.log("Rota DELETE /usuarios/:id/skills/wanted/:skillName solicitada");
  try {
    const userId = Number(req.params.id);
    const skillName = req.params.skillName;
    const db = conectarBD();

    const skill = await db.query("SELECT id FROM skills WHERE name = $1", [skillName]);
    if (skill.rows.length === 0) {
      return res.status(404).json({ erro: "Habilidade não encontrada" });
    }

    const result = await db.query(`
      DELETE FROM wanted_skills
      WHERE user_id = $1 AND skill_id = $2
      RETURNING *
    `, [userId, skill.rows[0].id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Habilidade desejada não encontrada para este usuário" });
    }

    res.json({ mensagem: "Habilidade desejada removida com sucesso!" });
  } catch (e) {
    console.error("Erro ao remover habilidade desejada:", e);
    res.status(500).json({ erro: "Erro interno ao remover habilidade desejada" });
  }
});

// ######
// Local onde o servidor escutar as requisições que chegam
// ######
app.listen(port, () => {
    console.log(`Serviço rodando na porta:  ${port}`);
});