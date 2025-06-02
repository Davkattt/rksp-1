import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        navigate('/');
      } else {
        setError('Ошибка входа');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка входа');
    }
  };

  return (
    <>
      <h2>Вход в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required /><br /><br />
        <label htmlFor="password">Пароль:</label>
        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required /><br /><br />
        <input type="submit" value="Войти" />
        <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
        {error && <div style={{color: 'red'}}>{error}</div>}
      </form>
    </>
  );
} 