#!/usr/bin/python3
""" holds class """
import models
from models.base_model import BaseModel, Base
# from models.city import City
from sqlalchemy import Column, String, ForeignKey, Date
from sqlalchemy.orm import relationship


class Exam(BaseModel, Base):
    """Representation of state"""
    __tablename__ = 'exams'
    school_name = Column(String(128), nullable=False)
    location = Column(String(128))
    subject_name = Column(String(128))
    session = Column(String(128))
    semester = Column(String(32))
    class_or_level = Column(String(128))
    course_code = Column(String(32))
    time_allocated = Column(String(32))
    department_name = Column(String(128))
    date = Column(Date)
    sections = relationship('Section',
                            backref="exam",
                            cascade='all, delete, delete-orphan')

    def __init__(self, *args, **kwargs):
        """initializes state"""
        super().__init__(*args, **kwargs)
