import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-rose-200 via-fuchsia-900 to-black">
      <h1 className="text-5xl font-bold text-black mb-8">
        Домашняя страница
      </h1>
      <div className="flex space-x-4">
        <Link to="/login" className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Авторизация
        </Link>
      </div>
    </div>
  );
}

export default Home;
