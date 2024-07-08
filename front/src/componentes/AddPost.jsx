import React, { useState } from 'react'; // Import useState hook from React
import { useLocation, Link, Navigate } from 'react-router-dom';
import '../styles/AddPost.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import NavBar from './NavBar';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default function AddPost() {
    const [msg, setMsg] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const [post, setPost] = useState({
        id: Date.now() + Math.random() % 250,
        titulo: '',
        descricao: '',
        foto: '',
        data: ''
    });

    const handleChange = (e) => {
        // Constroi o novo valor
        const novoValor = {
            id: Date.now() + Math.random() % 250,
            [e.target.name]: e.target.value
        };
        // Atualizar
        setPost({
            ...post,
            ...novoValor
        });
    };

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(post); // Changed from propriedade to post
        try {
            const resposta = await axios.post('http://localhost:3000/posts/adicionar-post', post, config);

            if (resposta.status === 200)
                setMsg('OK');
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
        }
    };

    if (!isAuthenticated) {
        // Redireciona para a página de erro de autenticação
        return <Navigate to="/auth-error" />;
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            // Atualiza o estado diretamente com a string Base64 da imagem
            handleChange({ target: { name: 'foto', value: reader.result } });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    if (msg === 'OK') {
        // Navegar para Home
        return <Navigate to='/home' />; // Assuming Navigate is imported and correctly used
    }

    return (
        <>
            <NavBar />
            <Form onSubmit={handleSubmit}>
                <Form.Label htmlFor="basic-url">Novo post</Form.Label>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3">Titulo</InputGroup.Text>
                    <Form.Control
                        id="titulo"
                        name="titulo"
                        aria-describedby="basic-addon1"
                        onChange={handleChange}
                        value={post.titulo}
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3">Adicione uma imagem (Opcional)</InputGroup.Text>
                    <Form.Control
                        id="foto"
                        name="foto"
                        type="file"
                        aria-describedby="basic-addon1"
                        onChange={handleFileChange}
                    />
                </InputGroup>

                <InputGroup>
                    <InputGroup.Text>Descrição</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        name="descricao"
                        aria-label="With textarea"
                        onChange={handleChange}
                        value={post.descricao}
                    />
                </InputGroup>

                <InputGroup>
                    <InputGroup.Text>Data</InputGroup.Text>
                    <Form.Control
                        type='date'
                        id="data"
                        name="data"
                        aria-describedby="basic-addon1"
                        onChange={handleChange}
                        value={post.data}
                    />
                </InputGroup>
                <Link to="/Home" className="btn btn-secondary">Voltar</Link>
                <Button type="submit" className="ml-2">Criar post</Button>
            </Form>
        </>
    );
}
