import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

export const useAuth = () => {
 const navigate = useNavigate();

 useEffect(() => {
   if (window.location.search.includes('access_token')) {
     const urlParams = new URLSearchParams(window.location.search);
     const accessToken = urlParams.get('access_token');

     fetch(`${apiUrl}/send_stat`, {
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