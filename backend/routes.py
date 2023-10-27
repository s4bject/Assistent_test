from flask import Blueprint, jsonify, request, Flask, render_template, url_for, redirect, session
import base64
import json
from datetime import datetime
from models import User,Exercise,WorkoutPlan,CompletedWorkout,Achievement,Goal,db,CurrentStat
import requests
from sqlalchemy.exc import IntegrityError

app = Blueprint('routes_app', __name__)


# Замените следующими значениями из ваших данных приложения
client_id = "23RHT5"
client_secret = "e98417175d9c5404052d1c3767c2e746"
redirect_uri = "https://127.0.0.1:5000/callback"  # Callback URL

@app.route('/auth')
def auth():
    # Отправьте пользователя на страницу аутентификации Fitbit
    auth_url = "https://www.fitbit.com/oauth2/authorize"
    params = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": "activity"
    }
    return redirect(auth_url + "?" + "&".join([f"{key}={value}" for key, value in params.items()]))


@app.route('/callback')
def callback():
    # Обработка callback от Fitbit, получение кода авторизации
    code = request.args.get('code')

    # Обмен кода на токен доступа
    token_url = "https://api.fitbit.com/oauth2/token"
    data = {
        "code": code,
        "grant_type": "authorization_code",
        "client_id": client_id,
        "redirect_uri": redirect_uri
    }

    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{client_id}:{client_secret}'.encode('utf-8')).decode('utf-8')}"
    }

    response = requests.post(token_url, data=data, headers=headers)
    if response.status_code == 200:
        access_token = response.json()["access_token"]
        session["access_token"] = access_token  # Сохраните токен в сессии пользователя
        return "Вы успешно аутентифицированы и токен доступа получен."
    else:
        return "Произошла ошибка при получении токена доступа."

@app.route('/send_stat')
def get_calories():
    # Получение затраченных калорий с использованием сохраненного токена
    access_token = session.get("access_token")
    if not access_token:
        return "Токен доступа не найден. Пожалуйста, выполните аутентификацию."

    current_date = datetime.now()
    formatted_date = current_date.strftime('%Y-%m-%d')
    url = f"https://api.fitbit.com/1/user/-/activities/date/{formatted_date}.json"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        try:

            stat = CurrentStat.query.filter_by(id=1).first()
            if stat:
                stat.steps = data['summary']['steps']
                stat.calories = data['summary']['caloriesOut']
                stat.date = formatted_date
            else:
                stat = CurrentStat(id=1, steps=data['summary']['steps'], calories=data['summary']['caloriesOut'],date=formatted_date)
                db.session.add(stat)
            db.session.commit()
            return jsonify({'message': 'Данные добавлены или обновлены'})
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'IntegrityError: Дупликация ключа'})