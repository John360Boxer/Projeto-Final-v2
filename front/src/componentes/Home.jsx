import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import '../styles/Home.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { Link, Navigate } from 'react-router-dom';

export default function Home() {
    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = (post) => {
        setSelectedPost(post);
        setShow(true);
    };

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/posts/posts', config);
                setPosts(response.data);
            } catch (error) {
                setError('Falha ao buscar posts');
                setIsAuthenticated(false); // Define como não autenticado em caso de erro
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async () => {
        let c = confirm(`Deseja apagar o post ${selectedPost.titulo}?`);
        if (c === true) {
            try {
                const resposta = await axios.delete(`http://localhost:3000/posts/deletar-post/${selectedPost.id}`, config);
                if (resposta.status === 200) location.reload();
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
            }
        }
    };

    if (!isAuthenticated) {
        // Redireciona para a página de erro de autenticação
        return <Navigate to="/auth-error" />;
    }

    return (
        <>
            <NavBar />
            <div className='postagens'>
                {error && <p className="error">{error}</p>}
                {posts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    posts.map(post => (
                        <Card key={post.id} className="card">
                            <Card.Img src={post.foto} />
                            <Card.Body className="card-body">
                                <div className='alinhar'>
                                    <Card.Title className='bold'>{post.titulo}</Card.Title>
                                    <button id='mais' onClick={() => handleShow(post)}>
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                </div>
                                <div className='informacoes'>
                                    <Card.Text>Data: {post.data}</Card.Text>
                                    <Card.Text>Temperatura: {post.temperatura} graus</Card.Text>
                                </div>
                                <Card.Text>{post.descricao}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
            {selectedPost && (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Opções do post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Selecione alguma das opções</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Excluir
                        </Button>
                        <Link to='/attPost' state={selectedPost}>Atualizar</Link>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}
