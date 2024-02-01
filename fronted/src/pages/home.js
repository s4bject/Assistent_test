import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Home = ({apiUrl}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${apiUrl}/profile`, {
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
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <h1 className="text-5xl font-bold text-white mb-8">
                Fitness Assistant
            </h1>
            <div className="flex space-x-4">
                <Link
                    to="/profile"
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
                >
                    Профиль
                </Link>
                {!isAuthenticated && (
                    <>
                        <Link
                            to="/register"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
                        >
                            Регистрация
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
                        >
                            Авторизация
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
