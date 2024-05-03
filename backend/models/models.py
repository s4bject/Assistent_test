import base64

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary
db = SQLAlchemy()
from datetime import datetime
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    fitbit_token = db.Column(db.String(256), nullable=False)
    goals = db.relationship('Goal', backref='user', cascade='all, delete-orphan')
    workout_plans = db.relationship('WorkoutPlan', backref='user', cascade='all, delete-orphan')
    current_stats = db.relationship('CurrentStat', backref='user', cascade='all, delete-orphan')


class WorkoutPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercises = db.relationship('Exercise', backref='workout_plan', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'user_id': self.user_id,
        }


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    workout_plan_id = db.Column(db.Integer, db.ForeignKey('workout_plan.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    image = db.Column(LargeBinary)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'workout_plan_id': self.workout_plan_id,
            'completed': self.completed,
            'image': base64.b64encode(self.image).decode('utf-8') if self.image else None
        }



class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    max_steps = db.Column(db.Integer)
    max_calories = db.Column(db.Integer)
    weight_goal = db.Column(db.Float)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'max_steps': self.max_steps,
            'max_calories': self.max_calories,
            'weight_goal': self.weight_goal
        }


class CurrentStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    steps = db.Column(db.Integer)
    current_weight = db.Column(db.Float)
    calories = db.Column(db.Integer)
    date = db.Column(db.String(120), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'steps': self.steps,
            'current_weight': self.current_weight,
            'calories': self.calories,
            'date': self.date
        }
