import os
import base64
import pdfkit
from flask import render_template, make_response, abort, request
from sqlalchemy.orm import joinedload
from models import storage
from models.exam import Exam
from api.v0.views import app_views
from flask_jwt_extended import jwt_required
from flasgger.utils import swag_from

def get_image_data_uri(image_rel_path, upload_base_path):
    """
    image_rel_path: 'questions/filename.jpg' or 'options/filename.png'
    upload_base_path: absolute path to 'static/uploads'
    """
    if not image_rel_path:
        return None
        
    full_path = os.path.join(upload_base_path, image_rel_path)
    
    # DEBUG: Check your terminal to see if this path is correct
    print(f"--- ATTEMPTING TO LOAD IMAGE: {full_path} ---")

    if not os.path.exists(full_path):
        print(f"--- FAILED: File does not exist at {full_path} ---")
        return None

    try:
        with open(full_path, "rb") as f:
            ext = image_rel_path.split('.')[-1].lower()
            mime = f"image/{ext}" if ext != 'jpg' else "image/jpeg"
            encoded = base64.b64encode(f.read()).decode('utf-8')
            return f"data:{mime};base64,{encoded}"
    except Exception as e:
        print(f"--- ERROR encoding image: {str(e)} ---")
        return None

@app_views.route('/exams/<exam_id>/pdf', methods=['GET'], strict_slashes=False)
@jwt_required()
@swag_from('documentation/exam/get_exam_pdf.yml', methods=['GET'])
def generate_exam_pdf(exam_id):
    session = storage.get_session()
    exam = session.query(Exam).filter_by(id=exam_id).first()

    if not exam:
        abort(404)

    # Path to 'api/v0/static/uploads'
    current_dir = os.path.dirname(os.path.abspath(__file__))
    upload_path = os.path.abspath(os.path.join(current_dir, ".."))
    font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'

    # Process all images
    for section in exam.sections:
        for q in section.questions:
            # Assign path to variable 'p' if it exists, then strip it
            q.image_data = get_image_data_uri(p.strip('/'), upload_path) if (p := q.image_path) else None
            
            for opt in q.options:
                opt.image_data = get_image_data_uri(p.strip('/'), upload_path) if (p := opt.image_path) else None

    html_content = render_template('exam_paper.html', exam=exam, font_path=font_path)

    options = {
        'enable-local-file-access': None,
        'encoding': "UTF-8",
        'quiet': '',
        'margin-top': '0.75in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in'
    }
    
    pdf = pdfkit.from_string(html_content, False, options=options)
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'

    # Get the mode from query params (?mode=preview)
    mode = request.args.get('mode', 'download')

    if mode == 'preview':
        # 'inline' opens it in the browser tab
        response.headers['Content-Disposition'] = 'inline; filename="exam.pdf"'
    else:
        # 'attachment' forces the browser to download the file
        response.headers['Content-Disposition'] = 'attachment; filename="exam.pdf"'

    return response
