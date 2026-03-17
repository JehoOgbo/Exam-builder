#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Questions """
from models.question import Question
from models.section import Section
from models import storage
from api.v0.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from flask_jwt_extended import jwt_required

@app_views.route('/questions', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/all_questions.yml', methods=['GET'])
def get_questions():
    """ Retrieves the list of all question objects """
    all_questions = storage.all(Question).values()
    list_questions = [q.to_dict() for q in all_questions]
    return jsonify(list_questions)

@app_views.route('/sections/<section_id>/questions', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/get_section_questions.yml', methods=['GET'])
def get_questions_by_section(section_id):
    """ Retrieves all questions within a specific section """
    section = storage.get(Section, section_id)
    if not section:
        abort(404, description="Section not found")
    
    all_questions = storage.all(Question).values()
    list_questions = [q.to_dict() for q in all_questions if q.section_id == section_id]
    return jsonify(list_questions)

@app_views.route('/questions/<question_id>', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/get_question.yml', methods=['GET'])
def get_question(question_id):
    """ Retrieves a specific question """
    question = storage.get(Question, question_id)
    if not question:
        abort(404)
    return jsonify(question.to_dict())

@app_views.route('/questions/<question_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/delete_question.yml', methods=['DELETE'])
def delete_question(question_id):
    """ Deletes a question object """
    question = storage.get(Question, question_id)
    if not question:
        abort(404)
    storage.delete(question)
    storage.save()
    return make_response(jsonify({}), 200)

@app_views.route('/questions', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/post_question.yml', methods=['POST'])
def post_question():
    """ Creates a question """
    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")
    
    required = ['query', 'section_id']
    for field in required:
        if field not in data:
            abort(400, description=f"Missing {field}")
    
    # Check if section exists
    if not storage.get(Section, data['section_id']):
        abort(400, description="Invalid section_id")

    instance = Question(**data)
    if instance.save() == 0:
        return make_response(jsonify(instance.to_dict()), 201)
    else:
        abort(409)

@app_views.route('/questions/<question_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/put_question.yml', methods=['PUT'])
def put_question(question_id):
    """ Updates a question """
    question = storage.get(Question, question_id)
    if not question:
        abort(404)

    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at', 'section_id']
    for key, value in data.items():
        if key not in ignore:
            setattr(question, key, value)
    
    if storage.save() == 0:
        return make_response(jsonify(question.to_dict()), 200)
    else:
        abort(409)
