//importar libs externas
const express = require('express'); //npm i express

//O router permite separar nosso servidor em rotas
const router = express.Router();

//autenticacao e cryp
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//libs para banco de dados
const fs = require('fs');
const path = require('path');

//Conexao com banco de dados
const bdPath = path.join(__dirname,'..','db','banco-dados-usuario.json');
const usuariosCadastrados = JSON.parse(fs.readFileSync(bdPath, {encoding: 'utf-8'}));

//Importars modelo de usuário
const User = require('../models/User');

//dotenv
require('dotenv').config();

//requisição POST para autenticar usuário.
//rota pública
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Busca pelo usuário no banco de dados
    const user = usuariosCadastrados.find(user => user.email === email);

    if (!user) {
        return res.status(409).send(`Usuário com email ${email} não existe.`);
    }

    // Verifica a senha
    const passwordValidado = await bcrypt.compare(password, user.password);
    if (!passwordValidado) {
        return res.status(422).send('Usuário ou senha incorretos.');
    }

    // Usuário autenticado, gera o token de acesso
    const tokenAcesso = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, process.env.TOKEN);

    return res.status(200).json(tokenAcesso);
});

//requisição POST para cadastrar usuário.
//rota pública
router.post('/create', async (req,res) => {
    //extraindo os dados do formulário para criacao do usuario
    const {username, email, password} = req.body; 
    //Para facilitar já estamos considerando as validações feitas no front
    //agora vamos verificar se já existe usuário com esse e-mail
    
    //verifica se já existe usuario com o email informado
    for (let users of usuariosCadastrados){
        if(users.email === email){
            //usuario já existe. Impossivel criar outro
            //Retornando o erro 409 para indicar conflito
            return res.status(409).send(`Usuario com email ${email} já existe.`);
        }   
    }
    //Deu certo. Vamos colocar o usuário no "banco"
    //Gerar um id incremental baseado na qt de users
    const id = usuariosCadastrados.length + 1;
    
    //gerar uma senha cryptografada
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password,salt);

    //Criacao do user
    const user = new User(id, username, email, passwordCrypt);

    //Salva user no "banco"
    usuariosCadastrados.push(user);
    fs.writeFileSync(bdPath,JSON.stringify(usuariosCadastrados,null,2));
    res.send(`Tudo certo usuario criado com sucesso. id=${id}`);
});

//requisição PUT para atualizar o perfil do usuário
//rota protegida
router.put('/update', autenticarToken, async (req, res) => {
    const { id, username, email, password } = req.body;

    const userIndex = usuariosCadastrados.findIndex(u => u.id === id);
    if (userIndex === -1) {
        return res.status(404).send('Usuário não encontrado.');
    }

    if (username) {
        usuariosCadastrados[userIndex].username = username;
    }
    if (email) {
        usuariosCadastrados[userIndex].email = email;
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        usuariosCadastrados[userIndex].password = await bcrypt.hash(password, salt);
    }

    fs.writeFileSync(bdPath, JSON.stringify(usuariosCadastrados, null, 2));
    res.send('Perfil atualizado com sucesso.');
});

//requisição DELETE para deletar o perfil do usuário
//rota protegida
router.delete('/delete/:id', autenticarToken, (req, res) => {
    const { id } = req.params;

    const userIndex = usuariosCadastrados.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).send('Usuário não encontrado.');
    }

    usuariosCadastrados.splice(userIndex, 1);
    fs.writeFileSync(bdPath, JSON.stringify(usuariosCadastrados, null, 2));
    res.send('Usuário deletado com sucesso.');
});

function autenticarToken(req, res, next) {
    const authH = req.headers['authorization'];
    const token = authH && authH.split(' ')[1];
    if (token == null) return res.status(401).send('Token não encontrado');
    
    try {
        const user = jwt.verify(token, process.env.TOKEN);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).send('Token inválido');
    }
}

module.exports = router;

//Gerando token de acesso secreto com node
//require('crypto').randomBytes(64).toString('hex');
//TOKEN
//importanto observar que, em um caso real, esse arquivo .env não é enviado para o repositório.
