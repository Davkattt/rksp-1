export default function Contacts() {
  return (
    <>
      <h2>Контакты</h2>
      <p>Если у вас есть вопросы или вы хотите оставить заявку, пожалуйста, свяжитесь с нами:</p>
      <ul>
        <li><strong>Телефон:</strong> +7 123 456 78 90</li>
        <li><strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a></li>
        <li><strong>Адрес:</strong> Москва, ул. Ленина, д. 1</li>
      </ul>
      <form>
        <label htmlFor="name">Имя:</label>
        <input type="text" id="name" name="name" /><br /><br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" /><br /><br />
        <label htmlFor="message">Сообщение:</label>
        <textarea id="message" name="message"></textarea><br /><br />
        <input type="submit" value="Отправить" />
      </form>
    </>
  );
} 