import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Registration = ({ apiUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

       if (response.ok) {
        setSuccessMessage('Регистрация успешна!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Ошибка при регистрации');
      }
    } catch (error) {
      setErrorMessage('Ошибка сети');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-800">
      {successMessage && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center p-4 bg-green-500 text-white">
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center p-4 bg-red-500 text-white">
          <span>{errorMessage}</span>
        </div>
      )}
      <header className="p-20 bg-transparent text-white text-center relative h-30">
        <h1 className="text-4xl font-bold">Регистрация</h1>
      </header>
      <main className="p-6 flex justify-center items-center">
        <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="name">
              Имя:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="password">
              Пароль:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6 flex justify-center">
            <button
              type="submit"
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Registration;
