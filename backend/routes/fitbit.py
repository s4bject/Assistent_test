from flask import Blueprint, request, redirect, session, g
import base64
from datetime import datetime
from backend.models.models import db, CurrentStat, User, Goal
import requests
from sqlalchemy.exc import IntegrityError

fitbit = Blueprint('routes_fitbit', __name__)

client_id = "23RHT5"
client_secret = "e98417175d9c5404052d1c3767c2e746"
redirect_uri = "https://127.0.0.1:5000/callback"


@fitbit.before_request
def load_logged_in_user():
   user_id = session.get('user_id')
   if user_id is None:
       g.user = None
   else:
       g.user = User.query.get(user_id)

@fitbit.route('/auth')
def auth():
    auth_url = "https://www.fitbit.com/oauth2/authorize"
    params = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": "activity"
    }
    return redirect(auth_url + "?" + "&".join([f"{key}={value}" for key, value in params.items()]))


@fitbit.route('/callback')
def callback():
    code = request.args.get('code')

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
        session["access_token"] = access_token
        g.user.fitbit_token = access_token
        db.session.commit()
        return redirect("http://localhost:3000/profile")
    else:
        return "Произошла ошибка при получении токена доступа."


from flask import jsonify


@fitbit.route('/send_stat')
def get_calories():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"error": "Токен доступа не найден. Пожалуйста, выполните аутентификацию."}), 401

    current_date = datetime.now()
    formatted_date = current_date.strftime('%Y-%m-%d')
    url = f"https://api.fitbit.com/1/user/-/activities/date/{formatted_date}.json"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(url, headers=headers)
    access_token = g.user.fitbit_token
    if not access_token:
        return jsonify({"error": "Токен доступа не найден. Пожалуйста, выполните аутентификацию."}), 401
    if response.status_code == 200:
        data = response.json()
        try:
            stat = CurrentStat.query.filter_by(id=1).first()
            if stat:
                stat.steps = data['summary']['steps']
                print(stat.steps)
                stat.calories = data['summary']['caloriesOut']
                stat.date = formatted_date
            else:
                stat = CurrentStat(id=1, steps=data['summary']['steps'], calories=data['summary']['caloriesOut'],
                                   date=formatted_date)
                db.session.add(stat)
            db.session.commit()
            return jsonify({"message": "Данные добавлены или обновлены", "stat": stat.to_dict()})
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "IntegrityError: Дупликация ключа"}), 400


@fitbit.route('/update_weight', methods=['POST'])
def update_weight():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"error": "Токен доступа не найден. Пожалуйста, выполните аутентификацию."}), 401

    data = request.json
    new_weight = data.get('current_weight')
    new_goalweight = data.get('weight_goal')
    print(data)
    if new_weight is None:
        return jsonify({"error": "Параметр 'current_weight' отсутствует в запросе."}), 400

    try:
        user_id = g.user.id
        current_stat = CurrentStat.query.filter_by(user_id=user_id).first()
        if current_stat:
            current_stat.current_weight = new_weight
        else:
            current_stat = CurrentStat(user_id=user_id, current_weight=new_weight)
            db.session.add(current_stat)

        goal = Goal.query.filter_by(user_id=user_id).first()
        if goal:
            goal.weight_goal = new_goalweight
        else:
            goal = Goal(user_id=user_id, weight_goal=new_goalweight)
            db.session.add(goal)

        db.session.commit()
        return jsonify({"message": "Текущий вес и цель по весу успешно обновлены.", "new_weight": new_weight})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@fitbit.route('/update_max_steps', methods=['POST'])
def update_max_steps():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"error": "Токен доступа не найден. Пожалуйста, выполните аутентификацию."}), 401

    data = request.json
    new_max_steps = data.get('max_steps')

    if new_max_steps is None:
        return jsonify({"error": "Параметр 'max_steps' отсутствует в запросе."}), 400

    try:
        user_id = g.user.id
        goal = Goal.query.filter_by(user_id=user_id).first()
        if goal:
            goal.max_steps = new_max_steps
        else:
            goal = Goal(user_id=user_id, max_steps=new_max_steps)
            db.session.add(goal)
        db.session.commit()
        return jsonify({"message": "Максимальное количество шагов успешно обновлено.", "new_max_steps": new_max_steps})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@fitbit.route('/update_max_calories', methods=['POST'])
def update_max_calories():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"error": "Токен доступа не найден. Пожалуйста, выполните аутентификацию."}), 401

    data = request.json
    new_max_calories = data.get('max_calories')

    if new_max_calories is None:
        return jsonify({"error": "Параметр 'max_calories' отсутствует в запросе."}), 400

    try:
        user_id = g.user.id
        goal = Goal.query.filter_by(user_id=user_id).first()
        if goal:
            goal.max_calories = new_max_calories
        else:
            goal = Goal(user_id=user_id, max_calories=new_max_calories)
            db.session.add(goal)
        db.session.commit()
        return jsonify({"message": "Максимальное количество калорий успешно обновлено.", "new_max_calories": new_max_calories})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

