//importar libs externas
const express = require('express'); //npm i express
const cors = require('cors'); //npm i cors

//Instância do servidor
const app = express();

//Liberar rota cors
app.use(cors());

//Utilizado para aumentar o peso máximo de imagens enviadas por usuários
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//Função para extrair os dados do pacote IP
app.use(express.json())

//importar rotas posts
const postsRoutes = require('./router/posts');

//importar rotas propriedades
const propriedadesRoutes = require('./router/propriedades');

//importar rotas autenticacao
const authRoutes = require('./router/auth');

//rotas para os serviços
app.use('/auth', authRoutes);
app.use('/propriedades', propriedadesRoutes);
app.use('/posts', postsRoutes);

app.listen(3000, ()=>{
    console.log('Servidor Ouvindo');
});