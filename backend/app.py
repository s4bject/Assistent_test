from flask import Flask, jsonify
from flask_cors import CORS
from backend.routes.auth import auth as routes_auth
from backend.routes.fitbit import fitbit as routes_fitbit
from backend.models.models import db
from flask_login import LoginManager
from backend.models.models import User
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'routes_auth.login'
login_manager.login_message_category = 'info'
CORS(app)

db.init_app(app)
app.register_blueprint(routes_auth)
app.register_blueprint(routes_fitbit)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return jsonify(message="Hello, World!")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(ssl_context='adhoc', debug=True)