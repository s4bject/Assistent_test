import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ apiUrl }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${apiUrl}/profile`, {
                    credentials: 'include'
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Ошибка при получении профиля:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white">
            <h1 className="text-5xl font-bold mb-8">Fitness Assistant</h1>
            <p className="text-lg mb-12">Лучший способ достичь ваших фитнес-целей</p>
            <div className="flex flex-col items-center space-y-4">
                <Link
                    to="/profile"
                    className={`bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ${isAuthenticated ? 'visible' : 'invisible'}`}
                >
                    Мой профиль
                </Link>
                <Link
                    to="/register"
                    className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ${isAuthenticated ? 'invisible' : 'visible'}`}
                >
                    Регистрация
                </Link>
                <Link
                    to="/login"
                    className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ${isAuthenticated ? 'invisible' : 'visible'}`}
                >
                    Войти
                </Link>
            </div>
        </div>
    );
};

export default Home;
