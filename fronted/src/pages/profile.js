import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { state } = useLocation();
  const { name, email, date } = state;
  const formattedDate = new Date(date).toLocaleDateString();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };


return (
  <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-400 to-blue-500">
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-md shadow-md mb-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Профиль пользователя</h2>
      <div className="mb-4">
        <p className="text-lg mb-2 font-bold">Имя: {name}</p>
        <p className="text-lg mb-2 font-bold">Email: {email}</p>
        <p className="text-lg font-bold">Дата регистрации: {formattedDate}</p>
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-br from-green-400 to-blue-500 text-white px-4 py-2 rounded hover:bg-black-500 transition duration-300"
      >
        Выйти
      </button>
    </div>
  </div>
);

};

export default Profile;
