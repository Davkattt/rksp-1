// frontend/src/pages/About.jsx
import { Users, Target, Award, Heart } from 'lucide-react';

export default function About() {
  const teamMembers = [
    {
      name: "Давыдова Екатерина",
      role: "Основатель и генеральный директор",
      image: "/images/team-member1.jpg",
      description: "Эксперт в области онлайн-образования с 10-летним опытом"
    },
    {
      name: "Иванов Алексей", 
      role: "Технический директор",
      image: "/images/team-member2.jpg",
      description: "Ведущий разработчик с опытом в создании образовательных платформ"
    },
    {
      name: "Петрова Мария",
      role: "Менеджер по маркетингу", 
      image: "/images/team-member3.jpg",
      description: "Специалист по цифровому маркетингу и развитию бренда"
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Качество обучения",
      description: "Мы тщательно отбираем преподавателей и контролируем качество каждого курса"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Сообщество",
      description: "Создаем активное сообщество студентов для взаимной поддержки и развития"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Достижения",
      description: "Помогаем студентам достигать карьерных целей и личностного роста"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Доступность",
      description: "Делаем качественное образование доступным для всех желающих"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">О нас</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Мы — команда энтузиастов, которая верит в силу образования и стремится сделать 
          качественное обучение доступным для каждого
        </p>
      </section>

      {/* Main Description */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша история</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Наш интернет-магазин курсов был создан в 2020 году с простой, но амбициозной целью — 
              предоставить доступ к качественному образованию для всех желающих, независимо от их 
              географического местоположения или финансовых возможностей.
            </p>
            <p>
              За время работы мы помогли тысячам студентов освоить новые навыки в программировании, 
              дизайне, маркетинге и других востребованных областях. Наши выпускники успешно работают 
              в ведущих IT-компаниях и создают собственные проекты.
            </p>
            <p>
              Мы продолжаем развиваться и расширять каталог курсов, добавляя новые направления 
              и форматы обучения для максимального удобства наших студентов.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Выпускников</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Курсов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Довольных студентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Наша миссия</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-8">
            Наша миссия — демократизировать образование, предоставляя доступ к качественным 
            знаниям от ведущих экспертов индустрии. Мы верим, что каждый человек заслуживает 
            возможности развиваться и достигать своих целей через обучение.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Наша команда</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="card text-center">
              <div className="p-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Готовы начать обучение?</h2>
        <p className="text-blue-100 mb-6">
          Присоединяйтесь к тысячам студентов, которые уже изменили свою жизнь с помощью наших курсов
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.href = '/courses'}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Посмотреть курсы
          </button>
          <button
            onClick={() => window.location.href = '/contacts'}
            className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Связаться с нами
          </button>
        </div>
      </section>
    </div>
  );
}