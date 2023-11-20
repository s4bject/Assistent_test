from flask_sqlalchemy import SQLAlchemy

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


class WorkoutPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creator = db.relationship('User', backref=db.backref('workout_plans', lazy=True))


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creator = db.relationship('User', backref=db.backref('exercises', lazy=True))


class CompletedWorkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('workout_plan.id'), nullable=False)
    workout_date = db.Column(db.Date, nullable=False)
    rating = db.Column(db.Integer)


class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    goal_type = db.Column(db.String(50), nullable=False)
    target_weight = db.Column(db.Float)


class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    achievement_date = db.Column(db.Date, nullable=False)


class CurrentStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    steps = db.Column(db.Integer)
    calories = db.Column(db.Integer)
    date = db.Column(db.String(120), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'steps': self.steps,
            'calories': self.calories,
            'date': self.date
        }
