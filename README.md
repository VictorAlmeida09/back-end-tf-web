# back-end-tf-web
Back-End do trabalho final da disciplina de WEB
Claro! Abaixo está a documentação pronta para ser colada diretamente no seu **`README.md`**, seguindo exatamente o formato solicitado e adaptada às rotas do **SkillSwap**:

---

**URL API**: https://skillswap-api.vercel.app *(substitua pela sua URL real quando publicar)*

**[GET] /usuarios**  
Descrição: Retorna todos os usuários cadastrados.

**[GET] /usuarios/{id}**  
Descrição: Retorna um único usuário com suas habilidades oferecidas e desejadas.

**[POST] /usuarios**  
Descrição: Cadastra um novo usuário.  

Body:
```json
{
  "name": "Samuel Caroba",
  "email": "samuel@example.com",
  "password": "minhasenha123",
  "contact": "@samuel_telegram",
  "photo_url": "https://exemplo.com/foto.jpg"
}
```

**[PUT] /usuarios/{id}**  
Descrição: Atualiza os dados de um usuário existente.  

Body:
```json
{
  "name": "Samuel R. Caroba",
  "email": "samuel.novo@example.com",
  "contact": "(11) 99999-8888",
  "photo_url": "https://exemplo.com/nova-foto.jpg"
}
```

**[DELETE] /usuarios/{id}**  
Descrição: Exclui um usuário e todas as suas habilidades associadas.

**[POST] /usuarios/{id}/skills/offered**  
Descrição: Adiciona ou atualiza uma habilidade que o usuário oferece.  

Body:
```json
{
  "skill_name": "Inglês",
  "level": "avançado",
  "description": "Conversação e redação acadêmica"
}
```

**[DELETE] /usuarios/{id}/skills/offered/{skillName}**  
Descrição: Remove uma habilidade oferecida pelo usuário.  
*(O nome da habilidade é passado como parâmetro na URL, codificado se necessário — ex: `Guitarra`)*

**[POST] /usuarios/{id}/skills/wanted**  
Descrição: Adiciona ou atualiza uma habilidade que o usuário deseja aprender.  

Body:
```json
{
  "skill_name": "Guitarra",
  "level": "iniciante",
  "description": "Aprender acordes básicos e ritmos"
}
```

**[DELETE] /usuarios/{id}/skills/wanted/{skillName}**  
Descrição: Remove uma habilidade desejada pelo usuário.  
*(O nome da habilidade é passado como parâmetro na URL — ex: `/usuarios/1/skills/wanted/Guitarra`)*

---

✅ **Observações**:
- Todos os campos em `POST /usuarios` exceto `contact` e `photo_url` são obrigatórios.
- Os níveis aceitos são: `"iniciante"`, `"intermediario"`, `"avançado"` (atenção à grafia).
- A API não inclui autenticação neste momento (MVP), mas recomenda-se adicionar em produção.

Basta copiar e colar essa seção no seu `README.md`!