import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [name, setName] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const userData = { email, password };

    try {
      const response = await fetch('https://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Успешная авторизация") {
          setName(data.name);
          history.push('/profile');
        }
      } else {
        setError('Неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  return (
    <div>
      <h2>Вход</h2>
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
        {name && <p>Вы вошли как {name}</p>} {/* Вывод имени пользователя после успешной авторизации */}
      </form>
    </div>
  );
};

export default Login;
