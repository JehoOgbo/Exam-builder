#!/usr/bin/python3
""" Index """
from api.v0.views import app_views
from flask import jsonify
from models import storage
from flask_jwt_extended import jwt_required
# from models.user import UserType


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """ Status of API """
    return jsonify({"status": "OK"})

@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def number_objects():
    """ Retrieves the number of each objects by type """
    classes = ["Exam", "Question", "Option", "User"]
    objects = ["exams", "questions", "options", "users"]

    num_objs = {}
    for i in range(len(classes)):
        num_objs[objects[i]] = storage.count(classes[i])

    return jsonify(num_objs)
