-- DML: Inserção de dados de exemplo

-- Usuários
INSERT INTO users (name, email, password_hash, contact, photo_url) VALUES
('Samuel Caroba', 'samuel@example.com', '$2b$10$...', '@samuel_telegram', 'https://example.com/sam.jpg'),
('Ana Silva', 'ana@example.com', '$2b$10$...', '(11) 99999-8888', NULL);

-- Habilidades (catálogo)
INSERT INTO skills (name) VALUES
('Inglês'),
('Guitarra'),
('Design Gráfico'),
('Edição de Vídeo');

-- Habilidades oferecidas
INSERT INTO offered_skills (user_id, skill_id, level, description) VALUES
(1, 1, 'avançado', 'Conversação e redação acadêmica'),
(2, 2, 'intermediario', 'Acordes, ritmos e improvisação básica');

-- Habilidades desejadas
INSERT INTO wanted_skills (user_id, skill_id, level, description) VALUES
(1, 2, 'iniciante', 'Aprender acordes básicos'),
(2, 1, 'intermediario', 'Praticar conversação diária');

-- Match sugerido (exemplo manual)
INSERT INTO matches (user_a_id, user_b_id, status) VALUES
(1, 2, 'suggested');