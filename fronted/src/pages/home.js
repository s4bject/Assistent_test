import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './style.css';

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://127.0.0.1:5000/profile', {
                    credentials: 'include'
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    return;
                }
            } catch (error) {
                console.error('Ошибка при получении профиля:', error);
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-rose-200 via-fuchsia-900 to-black">
            <h1 className="text-5xl font-bold text-black mb-8">
                Домашняя страница
            </h1>
            <div className="flex space-x-4">
                <Link to="/profile"
                      className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Профиль
                </Link>
                {!isAuthenticated && (
                    <>
                        <Link to="/register"
                              className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Регистрация
                        </Link>
                        <Link to="/login"
                              className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Авторизация
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};
export default Home;
