import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from './UseAuth';
import {useSpring, animated} from 'react-spring';

const Profile = ({apiUrl}) => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [statData, setStatData] = useState(null);
    const [steps, setSteps] = useState(0);
    const [calories, setCalories] = useState(0);
    const [maxsteps, setMaxSteps] = useState(0);
    const [maxcalories, setMaxCalories] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0);
    const [weightGoal, setWeightGoal] = useState(0);
    const [newWeight, setNewWeight] = useState('');
    const [newWeightGoal, setNewWeightGoal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // Состояние для определения типа модального окна ('maxSteps' или 'maxCalories')
    const [newMaxSteps, setNewMaxSteps] = useState(0); // Новое значение максимального количества шагов
    const [newMaxCalories, setNewMaxCalories] = useState(0); // Новое значение максимального количества калорий
    const navigate = useNavigate();

    useAuth();

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

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const updateWeight = async (newWeight, newWeightGoal) => {
        try {
            const response = await fetch(`${apiUrl}/update_weight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({current_weight: newWeight, weight_goal: newWeightGoal}),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log('Текущий вес и цель по весу успешно обновлены:', data);
                setCurrentWeight(newWeight);
                setWeightGoal(newWeightGoal);
                closeModal();
            } else {
                console.error('Ошибка при обновлении текущего веса и цели по весу:', data.error);
            }
        } catch (error) {
            console.error('Ошибка при обновлении текущего веса и цели по весу:', error);
        }
    };

    const updateMaxValue = async (newValue) => {
        try {
            const response = await fetch(`${apiUrl}/${modalType === 'maxSteps' ? 'update_max_steps' : 'update_max_calories'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({[modalType === 'maxSteps' ? 'max_steps' : 'max_calories']: newValue}),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.status === 200) {
                console.log(`Максимальное количество ${modalType === 'maxSteps' ? 'шагов' : 'калорий'} успешно обновлено:`, data);
                closeModal();
            } else {
                console.error(`Ошибка при обновлении максимального количества ${modalType === 'maxSteps' ? 'шагов' : 'калорий'}:`, data.error);
            }
        } catch (error) {
            console.error(`Ошибка при обновлении максимального количества ${modalType === 'maxSteps' ? 'шагов' : 'калорий'}:`, error);
        }
    };

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
                    setCurrentWeight(data.current_weight);
                    setWeightGoal(data.weight_goal);
                    setMaxSteps(data.max_steps);
                    setMaxCalories(data.max_calories);
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
        from: {width: '0%'},
        to: {width: `${maxsteps !== 0 ? (steps / maxsteps) * 100 : 0}%`},
        config: {duration: 1000},
    });

    const animatedCalories = useSpring({
        from: {width: '0%'},
        to: {width: `${maxcalories !== 0 ? (calories / maxcalories) * 100 : 0}%`},
        config: {duration: 1000},
    });

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white">
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
                                        <span
                                            className="absolute inset-0 flex items-center justify-center text-xs text-gray-800 font-semibold">
                                            {`${steps}/${maxsteps} (${((steps / (maxsteps)) * 100).toFixed(2)}%)`}
                                        </span>
                                    </animated.div>
                                </animated.div>
                                <button
                                    onClick={() => openModal('maxSteps')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105 mt-4"
                                >
                                    Изменить максимальное количество шагов
                                </button>
                                <p className="text-gray-700 text-lg font-semibold mb-2 mt-6">Количество калорий:</p>
                                <p className="text-gray-700 text-2xl font-semibold mb-6">{calories}</p>
                                <animated.div className="relative bg-gray-300 h-8 rounded-lg overflow-hidden">
                                    <animated.div className="bg-green-500 h-full" style={animatedCalories}>
                                        <span
                                            className="absolute inset-0 flex items-center justify-center text-xs text-gray-800 font-semibold">
                                            {`${calories}/${maxcalories} (${((calories / (maxcalories)) * 100).toFixed(2)}%)`}
                                        </span>
                                    </animated.div>
                                </animated.div>
                                <button
                                    onClick={() => openModal('maxCalories')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105 mt-4"
                                >
                                    Изменить максимальное количество калорий
                                </button>
                                <p className="text-gray-700 text-lg font-semibold mb-2 mt-6">Прогресс по весу:</p>
                                <div className="w-full md:w-1/2 flex justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-gray-700 text-lg font-semibold mb-1">Текущий вес:</p>
                                        <p className="text-gray-700 text-2xl font-semibold">{currentWeight} кг</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-gray-700 text-lg font-semibold mb-1">Цель по весу:</p>
                                        <p className="text-gray-700 text-2xl font-semibold">{weightGoal} кг</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => openModal('maxWeight')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105 mt-4"
                                    >
                                        Изменить вес
                                    </button>
                                </div>
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
                                    <img src="/img.png" alt="Fitbit Logo"
                                         className="w-12 h-12 object-cover object-center"/>
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
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="relative bg-white p-8 rounded shadow-md max-w-md w-full">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800">Изменить {modalType === 'maxSteps' ? 'максимальное количество шагов' : 'максимальное количество калорий'}</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="number"
                                value={modalType === 'maxSteps' ? newMaxSteps : newMaxCalories}
                                onChange={(e) => modalType === 'maxSteps' ? setNewMaxSteps(e.target.value) : setNewMaxCalories(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-gray-800"
                                placeholder={modalType === 'maxSteps' ? 'Новое количество шагов' : 'Новое количество калорий'}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => updateMaxValue(modalType === 'maxSteps' ? newMaxSteps : newMaxCalories)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105"
                                >
                                    Обновить {modalType === 'maxSteps' ? 'шаги' : 'калории'}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105"
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        {showModal && modalType === 'maxWeight' &&(
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white p-8 rounded shadow-md max-w-md w-full">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Изменить вес</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <input
                            type="number"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-gray-800"
                            placeholder="Новый вес (кг)"
                        />
                        <input
                            type="number"
                            value={newWeightGoal}
                            onChange={(e) => setNewWeightGoal(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-gray-800 mt-4"
                            placeholder="Новая цель по весу (кг)"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => updateWeight(newWeight, newWeightGoal)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105"
                            >
                                Обновить вес и цель
                            </button>
                            <button
                                onClick={closeModal}
                                className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
        ;
};

export default Profile;
