import React, { useState } from 'react';
import axios from 'axios';

function RecordForm({ history }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/records', { title, content }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      history.push('/records');
    } catch (error) {
      console.error('Error creating record', error);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить запись</h2>
      <input type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Содержание" value={content} onChange={(e) => setContent(e.target.value)} required />
      <button type="submit">Добавить</button>
    </form>
  );
}

export default RecordForm;