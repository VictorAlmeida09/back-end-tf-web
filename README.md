
# 📦 Back-End do Trabalho Final – SkillSwap

API RESTful para o sistema de troca de habilidades **SkillSwap**, desenvolvido para a disciplina de **Desenvolvimento Web**.

## 🔗 URL da API (Vercel)
```
https://back-end-tf-web-beryl.vercel.app/
```
---

## 📋 Rotas Disponíveis

### 👥 Usuários

#### **[GET] `/usuarios`**
- **Descrição**: Retorna todos os usuários cadastrados.
- **Resposta (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Samuel Caroba",
      "email": "samuel@example.com",
      "contact": "@samuel_telegram",
      "photo_url": "https://res.cloudinary.com/.../foto.jpg",
      "created_at": "2026-01-12T15:30:00Z",
      "skillsOffered": [
        { "skill_name": "Inglês", "level": "avançado", "description": "Conversação..." }
      ],
      "skillsWanted": [
        { "skill_name": "Guitarra", "level": "iniciante", "description": "Aprender acordes..." }
      ]
    }
  ]
  ```

#### **[GET] `/usuarios/{id}`**
- **Descrição**: Retorna um usuário específico com suas habilidades.
- **Parâmetros**: `id` (inteiro)
- **Resposta (200 OK)**: Objeto único do usuário (mesmo formato acima)
- **Erro (404)**: `{ "mensagem": "Usuário não encontrado" }`

#### **[POST] `/usuarios`**
- **Descrição**: Cadastra um novo usuário.
- **Body (JSON)**:
  ```json
  {
    "name": "Samuel Caroba",
    "email": "samuel@example.com",
    "password": "minhasenha123",
    "contact": "@samuel_telegram",
    "photo_url": "https://exemplo.com/foto.jpg"
  }
  ```
- **Resposta (201 Created)**: Dados do usuário criado (sem `password_hash`)
- **Erros**:
  - `400`: E-mail já cadastrado ou campos obrigatórios ausentes

#### **[PUT] `/usuarios/{id}`**
- **Descrição**: Atualiza nome, contato e foto do usuário.
- **Body (JSON)**:
  ```json
  {
    "name": "Samuel R. Caroba",
    "contact": "(11) 99999-8888",
    "photo_url": "https://exemplo.com/nova-foto.jpg"
  }
  ```
- **Observação**: **Não é possível alterar e-mail nem senha**.
- **Resposta (200 OK)**: `{ "mensagem": "Usuário atualizado com sucesso!" }`

#### **[DELETE] `/usuarios/{id}`**
- **Descrição**: Exclui o usuário e todas as suas habilidades/matches.
- **Resposta (200 OK)**: `{ "mensagem": "Usuário excluído com sucesso!" }`

---

### 🛠️ Habilidades

#### **[POST] `/usuarios/{id}/skills/offered`**
- **Descrição**: Adiciona/atualiza uma habilidade oferecida.
- **Body (JSON)**:
  ```json
  {
    "skill_name": "Inglês",
    "level": "avançado",
    "description": "Conversação e redação acadêmica"
  }
  ```
- **Níveis válidos**: `"iniciante"`, `"intermediario"`, `"avançado"`
- **Resposta (201 Created)**: Mensagem de sucesso

#### **[DELETE] `/usuarios/{id}/skills/offered/{skillName}`**
- **Descrição**: Remove uma habilidade oferecida.
- **Exemplo de URL**: `/usuarios/1/skills/offered/Inglês`
- **Resposta (200 OK)**: Mensagem de sucesso

#### **[POST] `/usuarios/{id}/skills/wanted`**
- **Descrição**: Adiciona/atualiza uma habilidade desejada.
- **Body (JSON)**: mesmo formato de `offered`
- **Resposta (201 Created)**: Mensagem de sucesso

#### **[DELETE] `/usuarios/{id}/skills/wanted/{skillName}`**
- **Descrição**: Remove uma habilidade desejada.
- **Exemplo de URL**: `/usuarios/1/skills/wanted/Guitarra`
- **Resposta (200 OK)**: Mensagem de sucesso

---

### 🤝 Matches

#### **[POST] `/matches`**
- **Descrição**: Cria uma solicitação de match entre dois usuários.
- **Body (JSON)**:
  ```json
  {
    "user_a_id": 1,
    "user_b_id": 2
  }
  ```
- **Regras**:
  - Não permite match consigo mesmo
  - Não permite duplicatas (em qualquer direção)
- **Resposta (201 Created)**:
  ```json
  {
    "mensagem": "Solicitação de match enviada com sucesso!",
    "match": {
      "id": 1,
      "user_a_id": 1,
      "user_b_id": 2,
      "status": "suggested",
      "matched_at": "2026-01-12T15:30:00Z"
    }
  }
  ```

#### **[GET] `/matches?user_id={id}`**
- **Descrição**: Retorna todos os matches envolvendo o usuário.
- **Parâmetro**: `user_id` (obrigatório)
- **Resposta (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "user_a_id": 1,
      "user_b_id": 2,
      "status": "suggested",
      "matched_at": "2026-01-12T15:30:00Z",
      "other_user": {
        "id": 2,
        "name": "Ana Silva",
        "contact": "(11) 99999-8888"
      }
    }
  ]
  ```

#### **[PUT] `/matches/{id}`**
- **Descrição**: Aceita ou recusa um match pendente.
- **Body (JSON)**:
  ```json
  { "status": "accepted" }
  ```
- **Valores válidos**: `"accepted"`, `"declined"`
- **Resposta (200 OK)**: Mensagem de sucesso

---

### ☁️ Upload de Imagens

#### **[POST] `/upload`**
- **Descrição**: Faz upload de imagem para o Cloudinary.
- **Body (JSON)**:
  ```json
  {
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```
- **Resposta (200 OK)**:
  ```json
  { "url": "https://res.cloudinary.com/.../imagem.jpg" }
  ```

---

## ⚙️ Tecnologias Utilizadas
- **Linguagem**: Node.js (ES Modules)
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL (Neon)
- **Armazenamento**: Cloudinary
- **Deploy**: Vercel

---

## 🔒 Observações de Segurança (MVP)

- **Senhas em texto claro**: aceitável apenas para MVP
- **Sem autenticação JWT**: frontend gerencia sessão via `localStorage`
- **CORS aberto**: configurado para permitir requisições do frontend
- **Em produção**: adicionar validação, sanitização e criptografia

### 👥 Integrantes

- **Hebert Barbosa Ferreira**  
  [https://github.com/hbf109](https://github.com/hbf109)

- **Jamylli Gabrielle Pereira Soares**  
  [https://github.com/Jamylli25](https://github.com/Jamylli25)

- **Lunan Paulino Oliveira**  
  [https://github.com/Lunanxz](https://github.com/Lunanxz)

- **Matheus José Faustino Balieiro**  
  [https://github.com/Matheus-Balieiro](https://github.com/Matheus-Balieiro)

- **Tulio Ribeiro Nery**  
  [https://github.com/tulioribeiro864](https://github.com/tulioribeiro864)

- **Victor Lucas Almeida Pinheiro**  
  [https://github.com/VictorAlmeida09](https://github.com/VictorAlmeida09)

