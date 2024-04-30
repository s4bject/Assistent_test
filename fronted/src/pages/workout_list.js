import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WorkoutPlanList = ({ apiUrl }) => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${apiUrl}/workout/plan`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setPlans(data);
        } else {
          console.error('Ошибка при получении тренировочных планов:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при получении тренировочных планов:', error);
      }
    };

    fetchPlans();
  }, [apiUrl]);

  const handleAddPlan = async () => {
    try {
      const response = await fetch(`${apiUrl}/workout/plan`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newPlan),
      });

      if (response.status === 200) {
        const data = await response.json();
        setPlans([...plans, data.plan]);
        setNewPlan({ name: '', description: '' });
        setShowModal(false);
      } else {
        console.error('Ошибка при создании тренировочного плана:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при создании тренировочного плана:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      const response = await fetch(`${apiUrl}/workout/plan/${planId}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        // Фильтруем план из списка
        const updatedPlans = plans.filter((plan) => plan.id !== planId);
        setPlans(updatedPlans);
      } else {
        console.error('Ошибка при удалении тренировочного плана:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при удалении тренировочного плана:', error);
    }
  };

  const handlePlanClick = (planId) => {
    navigate(`/workout/plan/${planId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="bg-white p-8 rounded shadow-md max-w-screen-lg w-full">
        <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">Тренировочные планы</h2>
        <button
          className="bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-md ml-4 transition duration-300 hover:bg-gray-800 focus:outline-none focus:ring focus:border-blue-300"
          onClick={() => setShowModal(true)}
        >
          Добавить план
        </button>
        <Link to="/profile">
          <button
            className="bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-md ml-4 transition duration-300 hover:bg-gray-800 focus:outline-none focus:ring focus:border-blue-300"
          >
            Вернуться в профиль
          </button>
        </Link>
      </div>
      <main className="p-6 w-full max-w-screen-lg">
        {plans.length > 0 ? (
          plans.map((plan, index) => (
            <div
              key={plan.id}
              className="mt-4 p-4 bg-white text-gray-800 rounded shadow-md cursor-pointer transition duration-300 hover:bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() => handlePlanClick(plan.id)}
            >
              <h2 className="text-2xl font-bold mb-2">{`${index + 1}: ${plan.name}`}</h2>
              <p className="text-gray-800">{plan.description}</p>
              <button
                className="mt-2 bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlan(plan.id);
                }}
              >
                Удалить
              </button>
            </div>
          ))
        ) : (
          <p className="text-white text-center">Нет доступных тренировочных планов.</p>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-3xl font-bold mb-6 text-center">Добавление плана</h2>
            <label className="block text-gray-800 text-lg font-bold mb-2" htmlFor="newPlanName">
              Название плана:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="newPlanName"
              type="text"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            <label className="block text-gray-800 text-lg font-bold mb-2 mt-4" htmlFor="newPlanDescription">
              Описание плана:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="newPlanDescription"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            ></textarea>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 hover:bg-gray-800 focus:outline-none focus:ring focus:border-blue-300"
                onClick={handleAddPlan}
              >
                Добавить
              </button>
              <button
                className="bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 hover:bg-gray-800 focus:outline-none focus:ring focus:border-blue-300 ml-4"
                onClick={() => setShowModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanList;
