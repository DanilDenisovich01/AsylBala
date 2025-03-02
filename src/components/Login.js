import React, { useState } from 'react';
import axios from 'axios';

function Login({ history, setIsAuthenticated, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/.netlify/functions/auth', { action: 'login', username, password });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      setUser({ username });
      history.push('/records');
    } catch (error) {
      console.error('Login error', error.response.data);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Войти</button>
    </form>
  );
}

export default Login;