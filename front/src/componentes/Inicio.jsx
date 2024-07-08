import React from 'react'
import '../styles/Inicio.css';
import {set, useForm} from 'react-hook-form'; //npm i react-hook-form
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

//Objeto para validação de campos com yup
const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(4,'Senha com no mínimo 4 caracteres').required(),
}).required();

export default function Inicio() {

    //Msg para armazenar resposta literal do servidor
    const [msg, setMsg] = useState(' ');

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const { register, handleSubmit, formState } = form;

    const {errors} = formState;

    const submit = async (data) => {
        
        try {
            const response = await axios.post('http://localhost:3000/auth/login', data);
            sessionStorage.setItem('token', response.data);
            setMsg('Usuário Autenticado');
        } catch (error) {
            console.log("erro aqui");
            setMsg(error.response.data);
        }   
        
    }

    if(msg.includes('Usuário Autenticado')){
        return <Navigate to='/home' />
    }

    return (
        <>
            <div className="Interacao">
                <h1>Bem vindo ao REDEX</h1>
                <p>O Projeto de extensão para todos tem +50 projetos cadastrados</p>
                <img src="./src/assets/Logo_RedEX.png"  width={236} height={95} alt="Logo do aplicativo Redex" />

                <form onSubmit={handleSubmit(submit)} noValidate>
                    <label htmlFor="email" placeholder="email">Email</label>
                    <input type="text" id="email" {...register('email')} />
                    <p className='erro'>{errors.email?.message}</p>

                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" {...register('password')} />
                    <p className='erro'>{errors.password?.message}</p>

                    <button>Entrar</button>
                </form>
                <p className="server-response">{msg}</p>

                {/* <Link to='/Home' className="button-link">Entrar</Link> */}
            </div>

            <div className="realizar-cadastro">
                Não possui conta?
                <Link to="/CreateUser">Cadastro</Link>
            </div>
            
        </>
    )

}