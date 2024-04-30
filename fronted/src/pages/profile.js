import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './UseAuth';
import { useSpring, animated } from 'react-spring';

const Profile = ({ apiUrl }) => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [statData, setStatData] = useState(null);
    const [steps, setSteps] = useState(0);
    const [calories, setCalories] = useState(0);
    const navigate = useNavigate();
    const MAX_STEPS = 10000;
    const MAX_CALORIES = 10000;

    useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${apiUrl}/profile`, {
                    credentials: 'include'
                });

                if (response.status === 401) {
                    setErrorMessage('Пользователь не авторизован. Пожалуйста, войдите или зарегистрируйтесь.');
                    return;
                }

                const data = await response.json();

                if (response.status === 200) {
                    setProfileData(data);
                    navigate('/profile');
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Ошибка при получении профиля:', error);
            }
        };

        fetchProfile();
    }, [apiUrl, navigate]);

    useEffect(() => {
        const fetchStat = async () => {
            try {
                const response = await fetch(`${apiUrl}/send_stat`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.status === 200) {
                    setStatData(data);
                    setSteps(data.stat.steps);
                    setCalories(data.stat.calories);
                }
            } catch (error) {
                console.error('Ошибка при получении статистики:', error);
            }
        };

        fetchStat();
    }, [apiUrl]);

    const animatedSteps = useSpring({
        from: { width: '0%' },
        to: { width: `${(steps / MAX_STEPS) * 100}%` },
        config: { duration: 1000 },
    });

    const animatedCalories = useSpring({
        from: { width: '0%' },
        to: { width: `${(calories / MAX_CALORIES) * 100}%` },
        config: { duration: 1000 },
    });

    const handleLogout = () => {
        fetch(`${apiUrl}/logout`, {
            credentials: 'include',
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/');
                } else {
                    throw new Error('Ошибка при выходе из системы');
                }
            })
            .catch(error => {
                console.error('Ошибка при выходе из системы:', error);
            });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white">
            <div className="bg-white p-8 rounded shadow-md max-w-screen-lg w-full">
                <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">Ваш профиль</h2>
                {errorMessage ? (
                    <p className="text-red-600 text-lg font-semibold mb-4 text-center">{errorMessage}</p>
                ) : (
                    profileData ? (
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                            <div className="w-full md:w-1/2">
                                <p className="text-gray-700 text-lg font-semibold mb-2">Имя:</p>
                                <p className="text-gray-700 text-2xl font-semibold mb-6">{profileData.name}</p>
                                <p className="text-gray-700 text-lg font-semibold mb-2">Email:</p>
                                <p className="text-gray-700 text-2xl font-semibold mb-6">{profileData.email}</p>
                                <p className="text-gray-700 text-lg font-semibold mb-2">Дата регистрации:</p>
                                <p className="text-gray-700 text-2xl font-semibold mb-6">{new Date(profileData.registration_date).toLocaleDateString()}</p>
                            </div>
                            <div className="w-full md:w-1/2">
                                <p className="text-gray-700 text-lg font-semibold mb-2">Количество шагов:</p>
                                <p className="text-gray-700 text-2xl font-semibold mb-6">{steps}</p>
                                <animated.div className="relative bg-gray-300 h-8 rounded-lg overflow-hidden">
                                    <animated.div className="bg-green-500 h-full" style={animatedSteps}>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-800 font-semibold">
                                            {`${steps}/${MAX_STEPS} (${((steps / MAX_STEPS) * 100).toFixed(2)}%)`}
                                        </span>
                                    </animated.div>
                                </animated.div>
                                <p className="text-gray-700 text-lg font-semibold mb-2">Количество калорий:</p>
                                <p className="text-gray-700 text-2xl font-semibold mb-6">{calories}</p>
                                <animated.div className="relative bg-gray-300 h-8 rounded-lg overflow-hidden">
                                    <animated.div className="bg-green-500 h-full" style={animatedCalories}>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-800 font-semibold">
                                            {`${calories}/${MAX_CALORIES} (${((calories / MAX_CALORIES) * 100).toFixed(2)}%)`}
                                        </span>
                                    </animated.div>
                                </animated.div>
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )
                )}
                <div className="mt-8 flex flex-col items-center space-y-4">
                    {profileData && (
                        <>
                            <button
                                className="bg-gray-600 hover:bg-gray-700 focus:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105"
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                            <Link
                                to="/"
                                className="bg-gray-600 hover:bg-gray-700 focus:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105"
                            >
                                Домашняя страница
                            </Link>
                            {profileData && (
                                <Link
                                    to="/workout/plan"
                                    className="bg-gray-600 hover:bg-gray-700 focus:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105"
                                >
                                    Планы тренировок
                                </Link>
                            )}
                            {profileData && (
                                <a
                                    onClick={() => window.location.href = `${apiUrl}/auth`}
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded shadow-md transition duration-500 ease-in-out hover:scale-105 flex items-center space-x-2"
                                >
                                    <img src="/img.png" alt="Fitbit Logo" className="w-12 h-12 object-cover object-center" />
                                </a>
                            )}
                        </>
                    )}
                    {!profileData && (
                        <>
                            <Link
                                to="/login"
                                className="bg-gray-600 hover:bg-gray-700 focus:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105"
                            >
                                Войти
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
