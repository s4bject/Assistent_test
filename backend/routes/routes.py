from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from io import BytesIO
from backend.models.models import WorkoutPlan, db, Exercise
import os

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
        user_id = current_user.id
        workout_plans = WorkoutPlan.query.filter_by(user_id=user_id).all()

        if workout_plans:
            plans_data = [plan.to_dict() for plan in workout_plans]
            return jsonify(plans_data), 200
        else:
            empty_plans = []
            return jsonify(empty_plans), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@workout_routes.route('/workout/plan/<int:plan_id>', methods=['GET'])
@login_required
def get_workout_plan_by_id(plan_id):
    try:
        user_id = current_user.id
        workout_plan = WorkoutPlan.query.filter_by(id=plan_id, user_id=user_id).first()

        if workout_plan:
            plan_data = workout_plan.to_dict()
            exercises = [exercise.to_dict() for exercise in workout_plan.exercises]
            plan_data['exercises'] = exercises
            return jsonify(plan_data), 200
        else:
            return jsonify({'error': 'Workout plan not found'}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@workout_routes.route('/workout/plan/<int:plan_id>', methods=['POST'])
@login_required
def add_exercise_to_workout_plan(plan_id):
    try:
        data = request.form
        name = data.get('name')
        description = data.get('description')
        completed = False

        workout_plan = WorkoutPlan.query.filter_by(id=plan_id, user_id=current_user.id).first()

        if not workout_plan:
            return jsonify({'error': 'Workout plan not found or does not belong to the user'}), 404

        file = request.files.get('file')

        if file:
            if file.mimetype.startswith('image'):
                image_blob = file.read()
            else:
                return jsonify({'error': 'Uploaded file is not an image'}), 400
        else:
            image_blob = None

        exercise = Exercise(name=name, description=description, workout_plan_id=plan_id, completed=completed,
                            image=image_blob)
        db.session.add(exercise)
        db.session.commit()

        return jsonify({'message': 'Exercise added successfully', 'exercise': exercise.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@workout_routes.route('/workout/exercise/<int:exercise_id>', methods=['PATCH'])
@login_required
def update_exercise_completed(exercise_id):
    try:
        data = request.json
        completed = data.get('completed')

        exercise = Exercise.query.filter_by(id=exercise_id).first()

        if not exercise:
            return jsonify({'error': 'Exercise not found'}), 404

        exercise.completed = completed
        db.session.commit()

        return jsonify(
            {'message': 'Exercise completed status updated successfully', 'exercise': exercise.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@workout_routes.route('/workout/plan/<int:plan_id>', methods=['DELETE'])
@login_required
def delete_workout_plan(plan_id):
    try:
        workout_plan = WorkoutPlan.query.filter_by(id=plan_id, user_id=current_user.id).first()

        if workout_plan:
            Exercise.query.filter_by(workout_plan_id=plan_id).delete()

            db.session.delete(workout_plan)
            db.session.commit()

            return jsonify({'message': 'Workout plan and associated exercises deleted successfully'}), 200
        else:
            return jsonify({'error': 'Workout plan not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@workout_routes.route('/workout/exercise/<int:exercise_id>', methods=['DELETE'])
@login_required
def delete_exercise_from_workout_plan(exercise_id):
    try:
        exercise = Exercise.query.filter_by(id=exercise_id).first()

        if exercise and exercise.workout_plan.user_id == current_user.id:
            db.session.delete(exercise)
            db.session.commit()
            return jsonify({'message': 'Exercise deleted successfully'}), 200
        else:
            return jsonify({'error': 'Exercise not found or does not belong to the user'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
