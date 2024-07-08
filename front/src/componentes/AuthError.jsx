import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthError.css'; // Adapte conforme necessário para o estilo

export default function AuthError() {
    return (
        <div className="auth-error">
            <h1>Você não está conectado à rede</h1>
            <p>Realize seu login para continuar!</p>
            <Link to="/" className="btn btn-primary">Voltar para Login</Link>
        </div>
    );
}