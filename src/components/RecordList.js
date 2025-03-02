import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecordList({ user }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get('/.netlify/functions/records', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setRecords(res.data);
      } catch (error) {
        console.error('Error fetching records', error);
      }
    };
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await axios.delete(`/.netlify/functions/records?id=${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setRecords(records.filter(record => record._id !== id));
      } catch (error) {
        console.error('Error deleting record', error);
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <h2>Список записей</h2>
      {records.map(record => (
        <div key={record._id}>
          <h3>{record.title}</h3>
          <p>{record.content}</p>
          <p>Автор: {record.createdBy.username}</p>
          {(user.role === 'admin' || record.createdBy._id === user.id) && (
            <button onClick={() => handleDelete(record._id)}>Удалить</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default RecordList;