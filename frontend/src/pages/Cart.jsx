// frontend/src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [navigate]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Ошибка при удалении курса из корзины');
    }
  };

  const createOrder = async () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }

    setProcessingOrder(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/orders', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Заказ успешно оформлен!');
      setCartItems([]);
      navigate('/profile'); // Redirect to profile to see orders
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при оформлении заказа');
    } finally {
      setProcessingOrder(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.course.price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ваша корзина пуста</h2>
          <p className="text-gray-600 mb-6">Добавьте курсы в корзину, чтобы начать обучение</p>
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary"
          >
            Перейти к курсам
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Курсы в корзине ({cartItems.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {item.course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.course.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {item.course.instructor && (
                          <span>Преподаватель: {item.course.instructor}</span>
                        )}
                        {item.course.duration && (
                          <span>Длительность: {item.course.duration}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-4">
                      <span className="text-xl font-semibold text-blue-600">
                        {item.course.price} ₽
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить из корзины"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Итого</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Количество курсов:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-xl font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Общая стоимость:</span>
                <span className="text-blue-600">{totalAmount} ₽</span>
              </div>
            </div>

            <button
              onClick={createOrder}
              disabled={processingOrder}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {processingOrder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Оформление...</span>
                </>
              ) : (
                <>
                  <span>Оформить заказ</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}