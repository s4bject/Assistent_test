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
    <div>
      <h2>Профиль пользователя</h2>
      <p>Имя: {name}</p>
      <p>Email: {email}</p>
      <p>Дата регистрации: {formattedDate}</p>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Profile;
