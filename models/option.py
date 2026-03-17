#!/usr/bin/python3
"""holds class Options"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from models.enum import QueryType


class Option(BaseModel, Base):
    """Representation of City"""
    __tablename__ = 'options'
    question_id = Column(String(60), ForeignKey('questions.id'), nullable=False)
    answer_string = Column(String(128), unique=True)
    image_path = Column(String(128))
    # answer_image = C
    # query_type = Column(Enum(QueryType), default=QueryType.OBJECTIVE, nullable=False)

    # options = relationship("Option",
    #                          backref="question",
    #                          cascade="all, delete, delete-orphan")

    def __init__(self, *args, **kwargs):
        """initializes a city"""
        super().__init__(*args, **kwargs)
