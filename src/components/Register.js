import React, { useState } from 'react';
import axios from 'axios';

function Register({ history, setIsAuthenticated, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/.netlify/functions/auth', { action: 'register', username, password, role });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      setUser({ username, role });
      history.push('/records');
    } catch (error) {
      console.error('Registration error', error.response.data);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="editor">Редактор</option>
        <option value="admin">Администратор</option>
      </select>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}

export default Register;