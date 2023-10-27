from flask import Flask, jsonify
from flask_cors import CORS
from routes import app as routes_app
from models import db
import requests

app = Flask(__name__)
app.secret_key = '23RHT55'
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://s4bject:sdds234432@localhost/fitnesstracker'
db.init_app(app)

@app.route('/')
def hello():
    return jsonify(message="Hello, World!")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.register_blueprint(routes_app)
    app.run(ssl_context='adhoc',debug=True)
