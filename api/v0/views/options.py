#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Options """
from models.option import Option
from models.question import Question
from models import storage
from api.v0.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from flask_jwt_extended import jwt_required
import os
from werkzeug.utils import secure_filename
from uuid import uuid4

UPLOAD_FOLDER = 'api/v0/static/uploads/options'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app_views.route('/questions/<question_id>/options', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/options/get_question_options.yml', methods=['GET'])
def get_options_by_question(question_id):
    """ Retrieves all options for a specific question """
    question = storage.get(Question, question_id)
    if not question:
        abort(404)
    return jsonify([option.to_dict() for option in question.options])

@app_views.route('/options/<option_id>', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/options/get_option.yml', methods=['GET'])
def get_option(option_id):
    """ Retrieves a specific option """
    option = storage.get(Option, option_id)
    if not option:
        abort(404)
    return jsonify(option.to_dict())

@app_views.route('/options', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/options/post_option.yml', methods=['POST'])
def post_option():
    """ Creates an option with optional image upload """
    question_id = request.form.get('question_id')
    answer_string = request.form.get('answer_string')

    if not question_id or not answer_string:
        abort(400, description="Missing question_id or answer_string")
    
    if not storage.get(Question, question_id):
        abort(400, description="Invalid question_id")

    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid4()}_{filename}"
            file.save(os.path.join(UPLOAD_FOLDER, unique_filename))
            image_path = os.path.join('static/uploads/options', unique_filename)

    new_option = Option(question_id=question_id, answer_string=answer_string, image_path=image_path)
    if new_option.save() == 0:
        return make_response(jsonify(new_option.to_dict()), 201)
    abort(409)

@app_views.route('/options/<option_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/options/put_option.yml', methods=['PUT'])
def put_option(option_id):
    """ Updates an option and handles image replacement """
    option = storage.get(Option, option_id)
    if not option:
        abort(404)

    data = request.form.to_dict()
    for key, value in data.items():
        if key not in ['id', 'created_at', 'updated_at', 'question_id']:
            setattr(option, key, value)

    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            # Clean up old file
            if option.image_path:
                old_path = os.path.join('api/v0', option.image_path)
                if os.path.exists(old_path):
                    os.remove(old_path)
            
            filename = secure_filename(file.filename)
            unique_name = f"{uuid4()}_{filename}"
            file.save(os.path.join(UPLOAD_FOLDER, unique_name))
            option.image_path = os.path.join('static/uploads/options', unique_name)

    storage.save()
    return jsonify(option.to_dict())

@app_views.route('/options/<option_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/options/delete_option.yml', methods=['DELETE'])
def delete_option(option_id):
    """ Deletes option and its file """
    option = storage.get(Option, option_id)
    if not option:
        abort(404)
    
    if option.image_path:
        path = os.path.join('api/v0', option.image_path)
        if os.path.exists(path):
            os.remove(path)
            
    storage.delete(option)
    storage.save()
    return make_response(jsonify({}), 200)
