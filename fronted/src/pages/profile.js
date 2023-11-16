import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from './UseAuth';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [statData, setStatData] = useState(null);
    const [steps, setSteps] = useState(null);
    const [calories, setCalories] = useState(null);
    const navigate = useNavigate();

    useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://127.0.0.1:5000/profile', {
                    credentials: 'include'
                });

                if (response.status === 401) {
                    setErrorMessage('Пользователь не авторизован. Пожалуйста, войдите или зарегистрируйтесь.');
                    return;
                }

                const data = await response.json();

                if (response.status === 200) {
                    console.log("data", data);
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
    }, [navigate]);

    useEffect(() => {
        const fetchStat = async () => {
            try {
                const response = await fetch('https://127.0.0.1:5000/send_stat', {
                    credentials: 'include'
                });


                const data = await response.json();

                if (response.status === 200) {
                    console.log("stat data", data);
                    setStatData(data);
                    setSteps(data.stat.steps);
                    setCalories(data.stat.calories);
                }
            } catch (error) {
                console.error('Ошибка при получении статистики:', error);
            }
        };

        fetchStat();
    }, [navigate]);

    const handleLogout = () => {
        fetch('https://127.0.0.1:5000/logout', {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-3xl font-bold mb-6 text-center">Профиль пользователя</h2>
                {errorMessage ? (
                    <p className="text-red-500 text-center text-lg font-bold mb-2">{errorMessage}</p>
                ) : (
                    profileData ? (
                        <div className="mb-4 space-y-2">
                            <p className="text-gray-700 text-lg font-bold mb-2">Имя: {profileData.name}</p>
                            <p className="text-gray-700 text-lg font-bold mb-2">Email: {profileData.email}</p>
                            <p className="text-gray-700 text-lg font-bold mb-2">Дата
                                регистрации: {new Date(profileData.registration_date).toLocaleDateString()}</p>
                            {statData ? (
                                <div className="mb-4 space-y-2">
                                    <p className="text-gray-700 text-lg font-bold mb-2">Количество шагов: {steps}</p>
                                    <p className="text-gray-700 text-lg font-bold mb-2">Количество
                                        калорий: {calories}</p>
                                </div>
                            ) : (
                                <p></p>
                            )}
                        </div>
                    ) : (
                        <p></p>
                    )
                )}
                <div className="mb-6 flex justify-center space-x-4">
                    {profileData && (
                        <button
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    )}
                    <Link
                        to="/"
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
                    >
                        Домашняя страница
                    </Link>
                </div>
                <div className="mb-6 flex justify-center space-x-4">
                    <a
                        onClick={() => window.location.href = 'https://127.0.0.1:5000/auth'}
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105 flex items-center space-x-2"
                    >
                        <img src="/img.png" alt="Fitbit Logo" className="w-12 h-12 object-cover object-center"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Profile;
