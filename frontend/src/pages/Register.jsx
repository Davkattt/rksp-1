import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/register', { name, email, password });
      if (res.data.id) {
        setSuccess('Регистрация успешна! Теперь вы можете войти.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('Ошибка регистрации');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  return (
    <>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Имя:</label>
        <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required /><br /><br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required /><br /><br />
        <label htmlFor="password">Пароль:</label>
        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required /><br /><br />
        <label htmlFor="confirm-password">Подтвердите пароль:</label>
        <input type="password" id="confirm-password" name="confirm-password" value={confirm} onChange={e => setConfirm(e.target.value)} required /><br /><br />
        <input type="submit" value="Зарегистрироваться" />
        {error && <div style={{color: 'red'}}>{error}</div>}
        {success && <div style={{color: 'green'}}>{success}</div>}
      </form>
      <footer>
        &copy; Интернет-магазин курсов, 2025. Все права защищены.
      </footer>
    </>
  );
} 