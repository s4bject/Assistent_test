import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

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
    const userData = {email, password};
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
        navigate('/profile', {state: {name: data.name, email: data.email, date: data.registration_date}});
      } else {
        setError('Неверный email или пароль, попробуйте снова');
        console.error('Ошибка: Неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  return (
      <div className="bg-gradient-to-t from-rose-200 via-fuchsia-900 to-black min-h-screen flex items-center justify-center">
        <form className="bg-gradient-to-t from-rose-200 via-fuchsia-800 to-gray-400 p-8 rounded shadow-md w-96">
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Авторизация</h2>
            <label className="block text-black text-lg font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-lg font-bold mb-2" htmlFor="password">
              Пароль:
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />
          </div>
          <div className="mb-6 flex justify-center">
            <button
                className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleLogin}
            >
              Войти
            </button>
          </div>
          {error && <p className="text-red-500 text-center font-bold text-xs italic">{error}</p>}
        </form>
      </div>
  );
};

export default Login;
