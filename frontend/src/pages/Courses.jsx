// frontend/src/pages/Courses.jsx
import { useState, useEffect } from 'react';
import { Clock, User, BarChart3 } from 'lucide-react';
import axios from 'axios';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Пожалуйста, войдите в аккаунт для добавления курсов в корзину');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/cart',
        { course_id: courseId },
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

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.level?.toLowerCase() === filter;
  });

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'начинающий':
        return 'bg-green-100 text-green-800';
      case 'средний':
        return 'bg-yellow-100 text-yellow-800';
      case 'продвинутый':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Наши курсы</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Выберите курс, который поможет вам достичь ваших целей в обучении и карьерном росте
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Все курсы
        </button>
        <button
          onClick={() => setFilter('начинающий')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'начинающий'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Начинающий
        </button>
        <button
          onClick={() => setFilter('средний')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'средний'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Средний
        </button>
        <button
          onClick={() => setFilter('продвинутый')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'продвинутый'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Продвинутый
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </h3>
                {course.level && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

              <div className="space-y-2 mb-4">
                {course.instructor && (
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    {course.instructor}
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Уровень: {course.level}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">{course.price} ₽</span>
              </div>

              <button
                onClick={() => addToCart(course.id)}
                className="btn-primary w-full"
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Курсы не найдены</p>
        </div>
      )}
    </div>
  );
}