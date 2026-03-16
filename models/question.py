#!/usr/bin/python3
"""holds class Question"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from models.enum import QueryType


class Question(BaseModel, Base):
    """Representation of City"""
    __tablename__ = 'questions'
    exam_id = Column(String(60), ForeignKey('exams.id'), nullable=False)
    query = Column(String(128), nullable=False, unique=True)
    query_type = Column(Enum(QueryType), default=QueryType.OBJECTIVE, nullable=False)

    options = relationship("Option",
                             backref="question",
                             cascade="all, delete, delete-orphan")

    def __init__(self, *args, **kwargs):
        """initializes a city"""
        super().__init__(*args, **kwargs)
