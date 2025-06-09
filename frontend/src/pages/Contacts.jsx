// frontend/src/pages/Contacts.jsx
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Телефон",
      content: "+7 (123) 456-78-90",
      link: "tel:+71234567890"
    },
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: "Email",
      content: "info@coursestore.ru",
      link: "mailto:info@coursestore.ru"
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-600" />,
      title: "Адрес",
      content: "Москва, ул. Тверская, д. 15, офис 301",
      link: "#"
    }
  ];

  const workingHours = [
    { day: "Понедельник - Пятница", time: "9:00 - 18:00" },
    { day: "Суббота", time: "10:00 - 16:00" },
    { day: "Воскресенье", time: "Выходной" }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Есть вопросы о курсах или нужна помощь? Мы всегда готовы помочь вам
        </p>
      </section>

      {/* Contact Info Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {contactInfo.map((info, index) => (
          <div key={index} className="card text-center">
            <div className="p-6">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
              {info.link && info.link !== '#' ? (
                <a 
                  href={info.link}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-gray-600">{info.content}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Отправить сообщение</h2>
          </div>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ваше имя"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Тема
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Выберите тему</option>
                <option value="course-info">Информация о курсах</option>
                <option value="technical-support">Техническая поддержка</option>
                <option value="payment">Вопросы по оплате</option>
                <option value="partnership">Сотрудничество</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
                placeholder="Опишите ваш вопрос подробно..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Отправка...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Отправить сообщение</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Additional Info */}
        <section className="space-y-8">
          {/* Working Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Время работы</h3>
            </div>
            <div className="space-y-3">
              {workingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="font-medium text-gray-900">{schedule.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Частые вопросы</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Как записаться на курс?</h4>
                <p className="text-sm text-gray-600">
                  Выберите интересующий курс, добавьте его в корзину и оформите заказ. 
                  После оплаты вы получите доступ к материалам.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Есть ли рассрочка?</h4>
                <p className="text-sm text-gray-600">
                  Да, для большинства курсов доступна рассрочка на 3-6 месяцев без переплат.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Можно ли получить сертификат?</h4>
                <p className="text-sm text-gray-600">
                  После успешного завершения курса вы получите сертификат о прохождении обучения.
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Следите за нами</h3>
            <p className="text-blue-100 mb-4">
              Подписывайтесь на наши социальные сети для получения актуальной информации о новых курсах и специальных предложениях.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all">
                Telegram
              </a>
              <a href="#" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all">
                VK
              </a>
              <a href="#" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all">
                YouTube
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}