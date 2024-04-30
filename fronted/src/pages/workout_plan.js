import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const WorkoutExc = ({ apiUrl }) => {
  const { planId } = useParams();
  const [planDetails, setPlanDetails] = useState(null);
  const [newExercise, setNewExercise] = useState({ name: '', description: '', completed: false });
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

  const handleAddExercise = async (event) => {
    event.preventDefault();

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
        setNewExercise({ name: '', description: '', completed: false });
      } else {
        console.error('Ошибка при добавлении упражнения:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      const response = await fetch(`${apiUrl}/workout/exercise/${exerciseId}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        setPlanDetails((prevDetails) => ({
          ...prevDetails,
          exercises: prevDetails.exercises.filter(exercise => exercise.id !== exerciseId),
        }));
      } else {
        console.error('Ошибка при удалении упражнения:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при удалении упражнения:', error);
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

  const handleCompletedChange = async (exerciseId) => {
    try {
      const response = await fetch(`${apiUrl}/workout/exercise/${exerciseId}`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ completed: !planDetails.exercises.find(exercise => exercise.id === exerciseId).completed }),
      });

      if (response.status === 200) {
        setPlanDetails((prevDetails) => {
          const updatedExercises = prevDetails.exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
              return { ...exercise, completed: !exercise.completed };
            }
            return exercise;
          });

          return { ...prevDetails, exercises: updatedExercises };
        });
      } else {
        console.error('Ошибка при обновлении состояния выполнения упражнения:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при обновлении состояния выполнения упражнения:', error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-800">
    <header className="p-6 bg-transparent text-white text-center relative">
      <Link to={'/workout/plan'} className="btn-secondary py-3 px-6 absolute left-6 top-6 bg-white text-gray-800 font-semibold rounded shadow ml-4 transition duration-300 hover:bg-gray-200 focus:outline-none focus:ring focus:border-blue-300">
        Вернуться к планам тренировок
      </Link>
      <h1 className="text-4xl font-bold">{planDetails ? planDetails.name : 'Тренировочный план'}</h1>
    </header>
    <main className="p-6">
      {planDetails ? (
        <div className="prose prose-lg mt-4 p-4 bg-white rounded shadow-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Описание плана</h2>
          <p className="text-gray-800 mb-4 overflow-ellipsis overflow-hidden max-h-48">
            {planDetails.description}
          </p>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Упражнения</h3>
            {planDetails.exercises && planDetails.exercises.length > 0 ? (
              <ul className="list-disc pl-4">
                {planDetails.exercises.map((exercise, index) => (
                  <li key={index} className={`text-gray-800 mb-2 ${exercise.completed ? 'bg-green-200' : 'bg-red-200'} rounded p-2 flex items-center justify-start`}>
                    <div>
                      <strong>{exercise.name}:</strong> {exercise.description}
                    </div>
                    <label className="inline-flex ml-2">
                      <input
                        type="checkbox"
                        checked={exercise.completed}
                        onChange={() => handleCompletedChange(exercise.id)}
                        className="form-checkbox h-6 w-6 text-gray-600 rounded transition duration-150 ease-in-out"
                      />
                      <span className={`ml-2 ${exercise.completed ? 'text-green-500' : 'text-red-500'}`}>
                        {exercise.completed ? 'Выполнено' : 'Не выполнено'}
                      </span>
                    </label>
                    <button
                      className="bg-red-500 hover:bg-red-600 focus:bg-red-600 ml-5 text-white py-1 px-4 rounded"
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-800">Нет добавленных упражнений.</p>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Добавить упражнение</h3>
            <form className="max-w-screen-md mx-auto">
              <div className="mb-4">
                <label className="block text-gray-800 text-lg font-bold mb-2" htmlFor="newExerciseName">
                  Название упражнения:
                </label>
                <input
                  className="input-field w-full px-4 py-2 rounded border focus:outline-none focus:border-gray-500"
                  id="newExerciseName"
                  type="text"
                  value={newExercise.name}
                  onChange={handleNameChange}
                />
                <p className="text-gray-500 text-sm">{`Осталось символов: ${maxNameLength - newExercise.name.length}`}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-lg font-bold mb-2 mt-4" htmlFor="newExerciseDescription">
                  Описание упражнения:
                </label>
                <textarea
                  className="input-field w-full px-4 py-2 rounded border focus:outline-none focus:border-gray-500"
                  id="newExerciseDescription"
                  value={newExercise.description}
                  onChange={handleDescriptionChange}
                ></textarea>
                <p className="text-gray-500 text-sm">{`Осталось символов: ${maxDescriptionLength - newExercise.description.length}`}</p>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-gray-500 hover:bg-gray-700 focus:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
                  onClick={handleAddExercise}
                >
                  Добавить упражнение
                </button>
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
