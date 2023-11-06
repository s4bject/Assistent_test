import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    const userData = { email, password };
     e.preventDefault();

    try {
      const response = await fetch('https://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 200) { // Проверка статуса ответа
        const data = await response.json();
        setName(data.name);
        setEmail(data.email)
        setDate(data.registration_date)
        navigate('/profile', { state: { name: data.name, email: data.email, date: data.registration_date } });
      } else {
        setError('Неверный email или пароль, попробуйте снова');
        console.error('Ошибка: Неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  return (
    <div className="login-container"> {/* Добавьте класс стилей к контейнеру */}
      <form>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <button onClick={handleLogin}>Войти</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
