export default function Cart() {
  return (
    <>
      <h2>Корзина</h2>
      <table>
        <thead>
          <tr>
            <th>Курс</th>
            <th>Цена</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Курс по веб-разработке</td>
            <td>5000 руб.</td>
            <td><button>Удалить</button></td>
          </tr>
          <tr>
            <td>Курс по дизайну</td>
            <td>4500 руб.</td>
            <td><button>Удалить</button></td>
          </tr>
        </tbody>
      </table>
      <p><strong>Итого:</strong> 9500 руб.</p>
      <button>Оформить заказ</button>
    </>
  );
} 