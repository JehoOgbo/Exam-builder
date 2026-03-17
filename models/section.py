#!/usr/bin/python3
"""holds class section"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import os
import shutil
from uuid import uuid4



class Section(BaseModel, Base):
    """Representation of the Section object"""
    __tablename__ = 'sections'
    name = Column(String(128), nullable=False)
    questions = relationship("Question",
                          backref="exam",
                          cascade="all, delete, delete-orphan")

    def __init__(self, *args, **kwargs):
        """initializes a sender"""
        super().__init__(*args, **kwargs)
