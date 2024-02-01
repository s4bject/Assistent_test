// WorkoutExc.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const WorkoutExc = ({ apiUrl }) => {
  const { planId } = useParams();
  const [planDetails, setPlanDetails] = useState(null);
  const [newExercise, setNewExercise] = useState({ name: '', description: '' });
  const [maxNameLength, setMaxNameLength] = useState(50);
  const [maxDescriptionLength, setMaxDescriptionLength] = useState(200);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/workout/plan/${planId}`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setPlanDetails(data);
        } else {
          console.error('Ошибка при получении деталей тренировочного плана:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при получении деталей тренировочного плана:', error);
      }
    };

    fetchPlanDetails();
  }, [apiUrl, planId]);

  const handleAddExercise = async () => {
    try {
      const response = await fetch(`${apiUrl}/workout/plan/${planId}`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newExercise),
      });

      if (response.status === 200) {
        const data = await response.json();
        setPlanDetails((prevDetails) => ({
          ...prevDetails,
          exercises: [...(prevDetails.exercises || []), data.exercise],
        }));
        setNewExercise({ name: '', description: '' });
      } else {
        console.error('Ошибка при добавлении упражнения:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxNameLength) {
      setNewExercise({ ...newExercise, name: value });
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxDescriptionLength) {
      setNewExercise({ ...newExercise, description: value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <header className="p-6 bg-transparent text-white text-center">
        <h1 className="text-4xl font-bold">{planDetails ? planDetails.name : 'Тренировочный план'}</h1>
      </header>
      <main className="p-6">
        {planDetails ? (
          <div className="prose prose-lg mt-4 p-4 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-green-500">Описание плана</h2>
            <p className="text-gray-700 mb-4 overflow-ellipsis overflow-hidden max-h-48">
              {planDetails.description}
            </p>
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 text-blue-500">Упражнения</h3>
              {planDetails.exercises && planDetails.exercises.length > 0 ? (
                <ul className="list-disc pl-4">
                  {planDetails.exercises.map((exercise, index) => (
                    <li key={index} className="text-gray-700 mb-2">
                      <strong>{exercise.name}:</strong> {exercise.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">Нет добавленных упражнений.</p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-500">Добавить упражнение</h3>
              <form className="max-w-screen-md mx-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="newExerciseName">
                    Название упражнения:
                  </label>
                  <input
                    className="input-field w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
                    id="newExerciseName"
                    type="text"
                    value={newExercise.name}
                    onChange={handleNameChange}
                  />
                  <p className="text-gray-500 text-sm">{`Осталось символов: ${maxNameLength - newExercise.name.length}`}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-lg font-bold mb-2 mt-4" htmlFor="newExerciseDescription">
                    Описание упражнения:
                  </label>
                  <textarea
                    className="input-field w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500"
                    id="newExerciseDescription"
                    value={newExercise.description}
                    onChange={handleDescriptionChange}
                  ></textarea>
                  <p className="text-gray-500 text-sm">{`Осталось символов: ${maxDescriptionLength - newExercise.description.length}`}</p>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    className="btn-primary py-3 px-6 mr-4 hover:bg-blue-500"
                    onClick={handleAddExercise}
                  >
                    Добавить упражнение
                  </button>
                  <Link to={'/workout/plan'} className="btn-secondary py-3 px-6">
                    Вернуться к планам тренировок
                  </Link>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-white text-center">Загрузка деталей тренировочного плана...</p>
        )}
      </main>
    </div>
  );
};

export default WorkoutExc;
