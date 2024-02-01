from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from backend.models.models import WorkoutPlan, db, Exercise
import uuid

workout_routes = Blueprint('workout_routes', __name__)

@workout_routes.route('/workout/plan', methods=['POST'])
@login_required
def create_workout_plan():
    data = request.json
    name = data.get('name')
    description = data.get('description')

    workout_plan = WorkoutPlan(name=name, description=description, user_id=current_user.id)
    db.session.add(workout_plan)
    db.session.commit()

    return jsonify({'message': 'Workout plan created successfully', 'plan': workout_plan.to_dict()})

@workout_routes.route('/workout/plan', methods=['GET'])
@login_required
def get_workout_plans():
    try:
        # Получаем все планы тренировок для текущего пользователя
        user_id = current_user.id
        workout_plans = WorkoutPlan.query.filter_by(user_id=user_id).all()

        if workout_plans:
            # Если планы тренировок найдены, возвращаем список их данных
            plans_data = [plan.to_dict() for plan in workout_plans]
            return jsonify(plans_data), 200
        else:
            # Если планы тренировок не найдены, возвращаем пустой список
            empty_plans = []
            return jsonify(empty_plans), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workout_routes.route('/workout/plan/<int:plan_id>', methods=['GET'])
@login_required
def get_workout_plan_by_id(plan_id):
    try:
        # Получаем план тренировки по его идентификатору вместе с упражнениями
        user_id = current_user.id
        workout_plan = WorkoutPlan.query.filter_by(id=plan_id, user_id=user_id).first()

        if workout_plan:
            # Если план тренировки найден, возвращаем данные, включая упражнения
            plan_data = workout_plan.to_dict()
            exercises = [exercise.to_dict() for exercise in workout_plan.exercises]
            plan_data['exercises'] = exercises
            return jsonify(plan_data), 200
        else:
            # Если план тренировки не найден, возвращаем ошибку 404
            return jsonify({'error': 'Workout plan not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@workout_routes.route('/workout/plan/<int:plan_id>', methods=['POST'])
@login_required
def add_exercise_to_workout_plan(plan_id):
    try:
        data = request.json
        name = data.get('name')
        description = data.get('description')

        # Проверяем, что тренировочный план существует и принадлежит текущему пользователю
        workout_plan = WorkoutPlan.query.filter_by(id=plan_id, user_id=current_user.id).first()

        if not workout_plan:
            return jsonify({'error': 'Workout plan not found or does not belong to the user'}), 404

        # Создаем новое упражнение и связываем его с тренировочным планом
        exercise = Exercise(name=name, description=description, workout_plan_id=plan_id)
        db.session.add(exercise)
        db.session.commit()

        return jsonify({'message': 'Exercise added successfully', 'exercise': exercise.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

