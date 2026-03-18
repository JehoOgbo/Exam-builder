#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Questions """
from models.question import Question
from models.section import Section
from models import storage
from api.v0.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from flask_jwt_extended import jwt_required
import os
from werkzeug.utils import secure_filename
from uuid import uuid4
from flask import current_app

@app_views.route('/sections/<section_id>/questions', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/get_section_questions.yml', methods=['GET'])
def get_questions_by_section(section_id):
    """ Retrieves all questions within a specific section """
    section = storage.get(Section, section_id)
    if not section:
        abort(404, description="Section not found")
    list_questions = []
    for question in section.questions:
        list_questions.append(question.to_dict())
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

# Define where to save images (you can also set this in your app config)
UPLOAD_FOLDER = 'api/v0/static/uploads/questions'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app_views.route('/questions', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/post_question.yml', methods=['POST'])
def post_question():
    """ Creates a question and saves an uploaded image if present """
    
    # Since we are sending a file, we use request.form instead of get_json()
    query = request.form.get('query')
    section_id = request.form.get('section_id')

    if not query or not section_id:
        abort(400, description="Missing query or section_id")

    if not storage.get(Section, section_id):
        abort(400, description="Invalid section_id")

    # Handle the Image File
    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            filename = secure_filename(file.filename)
            # Create a unique filename to prevent overwriting
            unique_filename = f"{uuid4()}_{filename}"
            full_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(full_path)
            # Store the relative path for the database
            image_path = os.path.join('static/uploads/questions', unique_filename)

    # Create instance
    new_data = {
        "query": query,
        "section_id": section_id,
        "image_path": image_path
    }
    
    instance = Question(**new_data)
    if instance.save() == 0:
        return make_response(jsonify(instance.to_dict()), 201)
    else:
        # If DB save fails, you might want to delete the uploaded file here
        abort(409)

# Assuming UPLOAD_FOLDER is defined as 'api/v0/static/uploads/questions'

@app_views.route('/questions/<question_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/questions/put_question.yml', methods=['PUT'])
def put_question(question_id):
    """ Updates a question and handles new image uploads """
    question = storage.get(Question, question_id)
    if not question:
        abort(404)

    # Use request.form for multipart data (text fields)
    data = request.form.to_dict()
    
    # Fields that should never be updated via this route
    ignore = ['id', 'created_at', 'updated_at', 'section_id']

    # 1. Handle Text Updates
    for key, value in data.items():
        if key not in ignore:
            setattr(question, key, value)

    # 2. Handle Image Update
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            # Delete the old image file if it exists
            if question.image_path:
                old_file_path = os.path.join('api/v0', question.image_path)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)

            # Save the new image
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid4()}_{filename}"
            
            # Ensure folder exists
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            full_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(full_path)
            
            # Update the model attribute
            question.image_path = os.path.join('static/uploads/questions', unique_filename)

    # 3. Save to Database
    if storage.save() == 0:
        return make_response(jsonify(question.to_dict()), 200)
    else:
        abort(409)
