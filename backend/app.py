from flask import Flask, jsonify
from flask_cors import CORS
from routes import app as routes_app
from models import db
from flask_login import LoginManager
from models import User

app = Flask(__name__)
app.secret_key = '23RHT55'
app.config['SECRET_KEY'] = 'your_secret_key'
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'routes_app.login'
login_manager.login_message_category = 'info'
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://s4bject:sdds234432@localhost/fitnesstracker'
db.init_app(app)
app.register_blueprint(routes_app)
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return jsonify(message="Hello, World!")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(ssl_context='adhoc',debug=True)
