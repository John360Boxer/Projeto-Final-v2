import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import '../styles/AttPost.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function AtualizarPost() {
    const { foto, titulo, descricao, data, temperatura, id } = useLocation().state;
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const [post, setPost] = useState({
        foto: foto,
        titulo: titulo,
        descricao: descricao,
        data: data,
        temperatura: temperatura,
        id: id
    });
    
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        const novoValor = {
            [e.target.name]: e.target.value
        };
        setPost({
            ...post,
            ...novoValor
        });
    };

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resposta = await axios.put('http://localhost:3000/posts/atualizar-post', post, config);
            if (resposta.status === 200) {
                setMsg('OK');
            }
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
        }
    };

    if (!isAuthenticated) {
        // Redireciona para a página de erro de autenticação
        return <Navigate to="/auth-error" />;
    }

    if (msg === 'OK') {
        return <Navigate to='/home' />;
    }

    return (
        <>
            <NavBar/>
            
            <div className="container1">
                <Form onSubmit={handleSubmit}>
                    <Form.Label htmlFor="basic-url">Atualizar a postagem</Form.Label>

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
                        <InputGroup.Text id="basic-addon3">Adicione uma imagem</InputGroup.Text>
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

                    <InputGroup className="mb-3 mt-3">
                        <InputGroup.Text id="basic-addon3">Data</InputGroup.Text>
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
                    <Button type="submit" className="ml-2">Atualizar</Button>
                </Form>
            </div>
        </>
    );
}