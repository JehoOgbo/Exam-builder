#!/usr/bin/python3
""" objects that handle default RESTful API actions for Exams """
from models.user import User
from models.exam import Exam
from models import storage
from api.v0.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask import current_app
from datetime import datetime

# current_dir = os.path.dirname(os.path.abspath(__file__))
# yaml_path = os.path.join(current_dir, 'exam', 'get_exam.yml')

@app_views.route('/users/<user_id>/exams', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/exam/get_exam.yml', methods=['GET'])
def get_exam(user_id):
    """
    Retrieves the list of all Exam objects belonging a user
    """
    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")
    list_exams = []
    for exam in user.exams:
        list_exams.append(exam.to_dict())
    return jsonify(list_exams)


@app_views.route('/exams/<exam_id>', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/exam/get_id_exam.yml', methods=['GET'])
def get_specific_exam(exam_id):
    """ Retrieves a specific Exam """
    exam = storage.get(Exam, exam_id)
    if not exam:
        abort(404)

    return jsonify(exam.to_dict())


@app_views.route('/exams/<exam_id>', methods=['DELETE'],
                 strict_slashes=False)
@jwt_required()
@swag_from('documentation/exam/delete_exam.yml', methods=['DELETE'])
def delete_exam(exam_id):
    """
    Deletes a Exam Object
    """

    current_user = get_jwt_identity()
    exam = storage.get(Exam, exam_id)

    if not exam:
        abort(404)

    storage.delete(exam)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/exams', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/exam/post_exam.yml', methods=['POST'])
def post_exam():
    """
    Creates a Exam
    """
    current_user = get_jwt_identity()
    if not request.get_json():
        abort(400, description="Not a JSON")
    current_app.logger.debug(f"I am alive")
    data = request.get_json()

    if 'date' in data and isinstance(data['date'], str):
        try:
            # This turns the string into a real Python date object
            data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            abort(400, description="Invalid date format. Use YYYY-MM-DD")

    if 'school_name' not in data:
        abort(400, description="Missing school_name")

    instance = Exam(**data)
    value = instance.save()
    if value == 0:
        return make_response(jsonify(instance.to_dict()), 201)
    else:
        abort(409)


@app_views.route('/exams/<exam_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/exam/put_exam.yml', methods=['PUT'])
def put_exam(exam_id):
    """
    Updates a Exam
    """
    current_user = get_jwt_identity()
    exam = storage.get(Exam, exam_id)

    if not exam:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(exam, key, value)
    value = storage.save()
    if value == 0:
        return make_response(jsonify(exam.to_dict()), 200)
    else:
        abort(409)
