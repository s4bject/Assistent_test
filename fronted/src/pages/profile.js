import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

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
                    console.log(data);
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
        <div
            className="bg-gradient-to-t from-rose-200 via-fuchsia-900 to-black min-h-screen flex items-center justify-center">
            <div className="bg-gradient-to-t from-rose-200 via-fuchsia-800 to-gray-400 p-8 rounded shadow-md w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-center">Профиль пользователя</h2>
                {errorMessage ? (
                    <p className="text-black text-center text-lg font-bold mb-2">{errorMessage}</p>
                ) : (
                    profileData ? (
                        <div>
                            <p className="text-black text-lg font-bold mb-2">Имя: {profileData.name}</p>
                            <p className="text-black text-lg font-bold mb-2">Email: {profileData.email}</p>
                            <p className="text-black text-lg font-bold mb-2">Дата
                                регистрации: {new Date(profileData.registration_date).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <p></p>
                    )
                )}
                <div className="mb-6 flex justify-center space-x-4">
                    {profileData && (
                        <button
                            className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    )}
                    <Link to="/"
                          className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Домашняя страница
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
