import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
 const navigate = useNavigate();

 useEffect(() => {
   if (window.location.search.includes('access_token')) {
     const urlParams = new URLSearchParams(window.location.search);
     const accessToken = urlParams.get('access_token');

     fetch('https://127.0.0.1:5000/send_stat', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         access_token: accessToken,
         // Ваши данные здесь
       }),
     })
     .then(response => response.json())
     .then(data => {
       // Перенаправьте пользователя обратно в профиль здесь
       navigate('/profile');
     });
   }
 }, [navigate]);
};