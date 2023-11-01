import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState(''); // Состояние для сообщения

  useEffect(() => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secretpassword',
    };

    axios.post('/register', data)
      .then(response => {
        // Обработка успешного ответа
        setMessage(response.data.message);
      })
      .catch(error => {
        // Обработка ошибки
        setMessage('Произошла ошибка при отправке запроса.');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Ваш интерфейс React-приложения */}
        <p>{message}</p> {/* Отображение сообщения */}
      </header>
    </div>
  );
}

export default App;
