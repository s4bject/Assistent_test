import bcrypt
from flask import Blueprint, jsonify, request, session, abort, url_for
from datetime import datetime
from backend.models.models import User, db, Goal, CurrentStat
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('routes_auth', __name__)


@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']
    password_hash = generate_password_hash(password)
    current_date = datetime.now()
    formatted_date = current_date.strftime('%Y-%m-%d')
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Пользователь с таким email уже существует"}), 400

    try:
        new_user = User(name=name, email=email, password_hash=password_hash, registration_date=formatted_date)
        db.session.add(new_user)
        db.session.commit()

        default_max_steps = 10000
        default_max_calories = 10000
        default_current_weight = 70
        default_weight_goal = 70
        new_goal = Goal(user_id=new_user.id, max_steps=default_max_steps, max_calories=default_max_calories,
                        weight_goal=default_weight_goal)
        db.session.add(new_goal)

        new_current_stat = CurrentStat(user_id=new_user.id, steps=0, calories=0, date=formatted_date, current_weight=default_current_weight)
        db.session.add(new_current_stat)

        db.session.commit()

        return jsonify({"message": "Регистрация прошла успешно"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Произошла ошибка при регистрации: {}".format(str(e))}), 500


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.json['email']
        password = request.json['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password) == True:
            login_user(user, remember=True)
            session['user_id'] = user.id
            return jsonify({"message": "Успешная авторизация", "redirect": url_for('routes_auth.profile')})
        else:
            return jsonify({"message": "Неверный email или пароль"}), 401
    else:
        return jsonify({"message": "Отсутствует метод get"})


@auth.route('/profile', methods=['GET'])
def profile():
    if current_user.is_authenticated:
        user_data = {
            "name": current_user.name,
            "email": current_user.email,
            "registration_date": current_user.registration_date
        }

        user_goal = Goal.query.filter_by(user_id=current_user.id).first()
        if user_goal:
            goal_data = {
                "max_steps": user_goal.max_steps,
                "max_calories": user_goal.max_calories,
                "weight_goal": user_goal.weight_goal
            }
            user_data.update(goal_data)

        current_stat = CurrentStat.query.filter_by(user_id=current_user.id).order_by(CurrentStat.id.desc()).first()
        if current_stat:
            current_stat_data = {
                "steps": current_stat.steps,
                "calories": current_stat.calories,
                "current_weight": current_stat.current_weight
            }
            user_data.update(current_stat_data)

        return jsonify(user_data)
    else:
        abort(401)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "logout"})
