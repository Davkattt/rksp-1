import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'));
    // слушаем изменения localStorage (logout из других вкладок)
    const handler = () => setIsAuth(!!localStorage.getItem('token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    navigate('/login');
  };

  return (
    <>
      <header>
        <h1>Интернет-магазин курсов</h1>
        <p>Лучшие курсы для вашего роста и развития!</p>
      </header>
      <nav>
        <ul>
          <li><NavLink to="/">Главная</NavLink></li>
          <li><NavLink to="/about">О нас</NavLink></li>
          <li><NavLink to="/courses">Курсы</NavLink></li>
          <li><NavLink to="/contacts">Контакты</NavLink></li>
          <li><NavLink to="/login">Вход</NavLink></li>
          <li><NavLink to="/cart">Корзина</NavLink></li>
          {isAuth && <li><NavLink to="/profile">Профиль</NavLink></li>}
          {isAuth && <li><button onClick={handleLogout} style={{background:'none',border:'none',color:'#007bff',cursor:'pointer'}}>Выйти</button></li>}
        </ul>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
} 