import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Login = ({ apiUrl }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
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
            const response = await fetch(`${apiUrl}/login`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.status === 200) {
                const data = await response.json();
                navigate(data.redirect);
            } else {
                setError('Неверный email или пароль, попробуйте снова');
                console.error('Ошибка: Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка при отправке данных на сервер:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-800">
            <header className="p-6 bg-transparent text-white text-center relative">
                <h1 className="text-4xl font-bold">Авторизация</h1>
            </header>
            <main className="p-6 flex justify-center items-center">
                <form className="bg-white p-8 rounded shadow-md w-96">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="password">
                            Пароль:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="mb-6 flex justify-center">
                        <button
                            className="bg-gray-500 hover:bg-gray-700 focus:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
                            onClick={handleLogin}
                        >
                            Войти
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center font-bold text-xs italic">{error}</p>}
                </form>
            </main>
        </div>
    );
};

export default Login;
