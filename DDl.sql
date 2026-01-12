-- DDL: Criação das tabelas

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- armazenar hash (ex: bcrypt)
    contact VARCHAR(100),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de habilidades (catálogo opcional, mas útil para consistência)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Tabela de níveis (opcional, mas ajuda na validação)
CREATE TYPE skill_level AS ENUM ('iniciante', 'intermediario', 'avançado');

-- Habilidades oferecidas pelos usuários
CREATE TABLE offered_skills (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    level skill_level NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (user_id, skill_id)
);

-- Habilidades desejadas pelos usuários
CREATE TABLE wanted_skills (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    level skill_level NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (user_id, skill_id)
);

-- Tabela de matches (opcional no MVP, mas incluída conforme solicitado)
CREATE TYPE match_status AS ENUM ('suggested', 'accepted', 'declined', 'completed');

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_a_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_b_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status match_status DEFAULT 'suggested',
    CHECK (user_a_id != user_b_id)
);

-- Índices para melhor desempenho nas buscas de matching
CREATE INDEX idx_offered_user ON offered_skills(user_id);
CREATE INDEX idx_wanted_user ON wanted_skills(user_id);
CREATE INDEX idx_offered_skill ON offered_skills(skill_id);
CREATE INDEX idx_wanted_skill ON wanted_skills(skill_id);