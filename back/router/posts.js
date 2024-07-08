const express = require('express'); //npm i express
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const pegaTempData = require('../utils/pegaTempData'); // Use o caminho correto

const bdPath = path.join(__dirname, '..', 'db', 'posts.json');
const posts = JSON.parse(fs.readFileSync(bdPath, { encoding: 'utf-8' }));

router.get('/posts', autenticarToken, (req, res) => {
  res.status(200).json(posts);
});

router.post('/adicionar-post', autenticarToken, async (req, res) => {
  const { id, titulo, descricao, data, foto } = req.body;

  try {
    const temperatura = await pegaTempData(data);
    
    const novoPost = {
      id,
      titulo,
      descricao,
      data,
      temperatura,
      foto
    };

    posts.push(novoPost);
    fs.writeFileSync(bdPath, JSON.stringify(posts, null, 2));
    res.status(200).send('Post criado com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar dados climáticos');
  }
});

router.put('/atualizar-post', autenticarToken, async (req, res) => {
  const { id, titulo, descricao, data, foto } = req.body;

  try {
    const temperatura = await pegaTempData(data); // Use await para resolver a Promise

    const novoPost = {
      id,
      titulo,
      descricao,
      data,
      temperatura,
      foto
    };

    const acharIndex = (p) => p.id === Number(id);
    const index = posts.findIndex(acharIndex);

    posts.splice(index, 1, novoPost);
    fs.writeFileSync(bdPath, JSON.stringify(posts, null, 2));
    res.status(200).send('Post atualizado com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar dados climáticos');
  }
});

router.delete('/deletar-post/:id', autenticarToken, (req,res) => {

  const {id} = req.params;

  const acharIndex = (p) => {
      return p.id === Number(id)
  }

  const index = posts.findIndex(acharIndex);

  posts.splice(index,1);

  fs.writeFileSync(bdPath, JSON.stringify(posts,null,2));

  res.status(200).send("Post deletado com sucesso.");

});

function autenticarToken(req, res, next) {
  const authH = req.headers['authorization'];
  const token = authH && authH.split(' ')[1];
  if (!token) return res.status(401).send('Token não encontrado');

  try {
    const user = jwt.verify(token, process.env.TOKEN);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send('Token inválido');
  }
}

module.exports = router;