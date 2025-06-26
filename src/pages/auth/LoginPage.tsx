// src/pages/Auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Heading } from '../../components/Heading';
import { SchoolIcon, KeyRound } from 'lucide-react';
import api from '../../services/api';
import './LoginPage.scss';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                login: email,
                password: password
            });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('authToken', token);

                navigate('/');
            }
        } catch (err) {
            console.error("Falha no login", err);
            setError('Email ou senha inválidos. Tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <Heading level={2} center icon={<SchoolIcon />}>
                    Gestão Acadêmica
                </Heading>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="uk-alert-danger" data-uk-alert><p>{error}</p></div>}
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        icon={<KeyRound size={20} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%' }}>
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
}