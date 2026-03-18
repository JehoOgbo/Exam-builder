#!/usr/bin/python3
"""holds class Question"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship


class Question(BaseModel, Base):
    """Representation of City"""
    __tablename__ = 'questions'
    section_id = Column(String(60), ForeignKey('sections.id'), nullable=False)
    query = Column(String(128), nullable=False, unique=True)
    image_path = Column(String(128))
    marks = Column(Integer)

    options = relationship("Option",
                             backref="question",
                             cascade="all, delete, delete-orphan")

    def __init__(self, *args, **kwargs):
        """initializes a city"""
        super().__init__(*args, **kwargs)
