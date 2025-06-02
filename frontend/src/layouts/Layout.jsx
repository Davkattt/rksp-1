// frontend/src/layouts/Layout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, BookOpen } from 'lucide-react';

export default function Layout() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
    
    if (token) {
      // Get user info from token storage
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    }
    
    // Listen for storage changes (logout from other tabs)
    const handler = () => {
      const newToken = localStorage.getItem('token');
      setIsAuth(!!newToken);
      if (!newToken) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
    setUser(null);
    navigate('/login');
  };

  const NavLinkWithClass = ({ to, children, ...props }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link ${isActive ? 'nav-link-active' : ''} px-3 py-2 rounded-md`
      }
      {...props}
    >
      {children}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Интернет-магазин курсов</h1>
                <p className="text-blue-200 text-sm">Лучшие курсы для вашего роста и развития!</p>
              </div>
            </div>
            
            {isAuth && user && (
              <div className="flex items-center space-x-4 text-sm">
                <User className="h-5 w-5" />
                <span>Привет, {user.name}!</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <NavLinkWithClass to="/">Главная</NavLinkWithClass>
              <NavLinkWithClass to="/about">О нас</NavLinkWithClass>
              <NavLinkWithClass to="/courses">Курсы</NavLinkWithClass>
              <NavLinkWithClass to="/contacts">Контакты</NavLinkWithClass>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isAuth ? (
                <NavLinkWithClass to="/login">Вход</NavLinkWithClass>
              ) : (
                <>
                  <NavLinkWithClass to="/cart" className="flex items-center space-x-1 text-white">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Корзина</span>
                  </NavLinkWithClass>
                  <NavLinkWithClass to="/profile" className="flex items-center space-x-1 text-white">
                    <User className="h-4 w-4" />
                    <span>Профиль</span>
                  </NavLinkWithClass>
                  <button
                    onClick={handleLogout}
                    className="nav-link flex items-center space-x-1 px-3 py-2 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; 2025 Интернет-магазин курсов. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}