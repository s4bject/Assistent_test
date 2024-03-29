import bcrypt
from flask import Blueprint, jsonify, request, session, abort, url_for
from datetime import datetime
from backend.models.models import User, db
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
    print(formatted_date)
    new_user = User(name=name, email=email, password_hash=password_hash, registration_date=formatted_date)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Регистрация прошла успешно"})


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
    print(session)
    if current_user.is_authenticated:
        return jsonify({
            "name": current_user.name,
            "email": current_user.email,
            "registration_date": current_user.registration_date
        })
    abort(401)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "logout"})
