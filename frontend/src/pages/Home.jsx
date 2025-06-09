// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Users } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/courses?limit=3');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Добро пожаловать в мир обучения
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Откройте для себя тысячи курсов от ведущих экспертов и начните свой путь к новым знаниям уже сегодня
        </p>
        <Link
          to="/courses"
          className="btn-primary text-lg px-8 py-3 inline-block"
        >
          Посмотреть все курсы
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Качественные курсы</h3>
          <p className="text-gray-600">Все курсы проверены экспертами и постоянно обновляются</p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Опытные преподаватели</h3>
          <p className="text-gray-600">Учитесь у профессионалов с многолетним опытом работы</p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Гибкий график</h3>
          <p className="text-gray-600">Учитесь в удобное для вас время в любом месте</p>
        </div>
      </section>

      {/* Popular Courses */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Популярные курсы</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
            Смотреть все →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const addToCart = async () => {
    if (!isLoggedIn) {
      alert('Пожалуйста, войдите в аккаунт для добавления курсов в корзину');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/cart',
        { course_id: course.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Курс добавлен в корзину!');
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Курс уже в корзине');
      } else {
        alert('Ошибка при добавлении курса в корзину');
      }
    }
  };

  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">{course.price} ₽</span>
          <div className="text-sm text-gray-500">
            {course.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </div>
            )}
          </div>
        </div>
        
        {course.instructor && (
          <p className="text-sm text-gray-500 mb-4">Преподаватель: {course.instructor}</p>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={addToCart}
            className="btn-primary flex-1"
          >
            В корзину
          </button>
          <Link
            to={`/courses/${course.id}`}
            className="btn-secondary"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}