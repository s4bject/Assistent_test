import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './style.css';

const Login = ({apiUrl}) => {
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
        const userData = {email, password};
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <form className="bg-white p-8 rounded shadow-md w-96">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold mb-6 text-center">Авторизация</h2>
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
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
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
