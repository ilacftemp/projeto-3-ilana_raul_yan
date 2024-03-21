import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Login(props){
    const [loginError, setLoginError] = useState('');
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    const criarUsuario = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('usuario');
        const email = formData.get('email');
        const senha = formData.get('senha');
        const data_criarConta = {
            'username': username,
            'email': email,
            'password': senha
        }

        axios.post('http://127.0.0.1:8000/api/users/', data_criarConta)
        .then(response => {
            console.log('r')
            console.log(response)
            if (response.status === 200) {
            console.log(`user ${username} successfully created`);
            setLoginError('');
            setToken(response.data.token)
            sessionStorage.setItem('token', response.data.token)
            sessionStorage.setItem('loggedIn', true);
            window.location.href = '/';
            }
        })
        .catch(error => {
            if (error.response) {
                const { data } = error.response;
                console.log("A")
                console.log(data)
                if (error.response) {
                    const { data } = error.response;
                    switch (data.message) {
                        case "Username or email already exists":
                            console.log(data.message)
                            setLoginError('Username or email already exists');
                            break;
                        case "Invalid username":
                            setLoginError('Invalid username');
                            break;
                        case "Invalid email":
                            setLoginError('Invalid email');
                            break;
                        case "Password is too short":
                            setLoginError('Password is too short');
                            break;
                        default:
                            alert("An error occurred.");
                            setLoginError('An error occurred.');
                            break;
                }
                } else {
                // Handle network or unexpected error
                alert("Unable to reach server. Please check your connection.");
                }
            }
        })
    }

    return (
        <div className="App">
            <header className="App-header">
            <h1>Jokeses</h1>
            <div><Link className="voltar" to={`..`}>Voltar</Link></div>
            </header>
            <div className="container">
                <form method="post" onSubmit={criarUsuario} className="form-usuario">
                    <input type="text" className="input" name="usuario" placeholder="Usuário"></input>
                    <input type="text" className="input" name="email" placeholder="E-mail"></input>
                    <input type="password" className="input" name="senha" placeholder="Senha" minLength={1} required></input>
                    <button type="submit" className="cadastrar">Sign-up</button>
                    {/* <button type="submit" className="cadastrar">Sign-up</button> */}
                </form>
                <p>{loginError}</p>
            </div>
        </div>
    );
}