#!/usr/bin/python3
""" Endpoint for printing pdf """
import pdfkit
from api.v0.views import app_views
from flask import render_template, make_response
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import joinedload
from models.exam import Exam
from flasgger.utils import swag_from
from models import storage
from models.section import Section


@app_views.route('/exams/<exam_id>/pdf', methods=['GET'])
@jwt_required()
@swag_from('documentation/exam/get_exam_pdf.yml', methods=['GET'])
def generate_exam_pdf(exam_id):
    # This single query fetches the whole hierarchy at once
    session = storage.get_session()
    exam = session.query(Exam).options(
        joinedload(Exam.sections).joinedload(Section.questions)
    ).filter_by(id=exam_id).first()

    if not exam:
        abort(404)
        
    # ... proceed to render_template
    #exam = storage.get(Exam, exam_id)
    #if not exam:
    #    abort(404)

    # 1. Render the HTML with your data
    html_content = render_template('exam_paper.html', exam=exam)

    # 2. Convert to PDF
    pdf = pdfkit.from_string(html_content, False)

    # 3. Create a response with the correct headers
    #response = make_response(pdf)
    #response.headers['Content-Type'] = 'application/pdf'
    #response.headers['Content-Disposition'] = f'inline; filename={exam.course_code}.pdf'
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=exam_{exam_id}.pdf'
    return response
    
