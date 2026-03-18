#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Sections """
from models.section import Section
from models.exam import Exam
from models import storage
from api.v0.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from flask_jwt_extended import jwt_required, get_jwt_identity

@app_views.route('/exams/<exam_id>/sections', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/sections/get_exam_sections.yml', methods=['GET'])
def get_sections_by_exam(exam_id):
    """
    Retrieves the list of all section objects belonging to a specific exam
    """
    # Verify the exam exists first
    exam = storage.get(Exam, exam_id)
    if not exam:
        abort(404, description="Exam not found")

    # Filter sections where exam_id matches
    list_sections = []
    for section in exam.sections:
        list_sections.append(section.to_dict())
    return jsonify(list_sections)

@app_views.route('/sections/<section_id>', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/sections/get_sections.yml', methods=['GET'])
def get_section(section_id):
    """ Retrieves a specific section """
    section = storage.get(Section, section_id)
    if not section:
        abort(404)
    return jsonify(section.to_dict())


@app_views.route('/sections/<section_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/sections/delete_section.yml', methods=['DELETE'])
def delete_section(section_id):
    """ Deletes a section Object """
    section = storage.get(Section, section_id)
    if not section:
        abort(404)

    storage.delete(section)
    storage.save()
    return make_response(jsonify({}), 200)


@app_views.route('/sections', methods=['POST'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/sections/post_section.yml', methods=['POST'])
def post_section():
    """ Creates a section """
    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    # Required fields based on the Section model
    required = ['name', 'exam_id']
    for field in required:
        if field not in data:
            abort(400, description=f"Missing {field}")

    instance = Section(**data)
    # Following your specific logic: assuming save() returns 0 on success
    if instance.save() == 0:
        return make_response(jsonify(instance.to_dict()), 201)
    else:
        abort(409)


@app_views.route('/sections/<section_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/sections/put_section.yml', methods=['PUT'])
def put_section(section_id):
    """ Updates a section """
    section = storage.get(Section, section_id)
    if not section:
        abort(404)

    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at', 'exam_id']

    for key, value in data.items():
        if key not in ignore:
            setattr(section, key, value)
    
    if storage.save() == 0:
        return make_response(jsonify(section.to_dict()), 200)
    else:
        abort(409)
