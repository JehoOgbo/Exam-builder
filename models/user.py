#!/usr/bin/python3
"""holds class sender"""
import models
# from models.enum import UserType
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import os
import shutil
from uuid import uuid4



class User(BaseModel, Base):
    """Representation of the Sender"""
    __tablename__ = 'users'
    name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    password = Column(String(1024), nullable=False)
    # user_type = Column(Enum(UserType), default=UserType.REGULAR,
    #                   nullable=False)
    # phone_number = Column(String(128), nullable=True)
    # image_path = Column(String(255), nullable=True)
    # store a path to the image in image_path
    # saved_filename = Column(String(255), unique=True, nullable=True)
    # deliveries = relationship("Delivery",
    #                           backref="sender",
    #                           cascade="all, delete, delete-orphan")
    # reviews = relationship("Review", backref="sender")

    def __init__(self, *args, **kwargs):
        """initializes a sender"""
        super().__init__(*args, **kwargs)

    #def __setattr__(self, name, value):
        #"""set the unique saved file name"""
        #if name == 'image_path':
            #new_val = value[:]
            #file_ext = os.path.splitext(new_val)[1]
            #unique_filename = f"{uuid4()}{file_ext}"
            #save_path = os.path.join('uploads/images', unique_filename)
            #shutil.copy(value, save_path)
            #super.__setattr__('saved_filename', save_path)
        #super().__setattr__(name, value)
        #if name == "password":
            #value = md5(value.encode()).hexdigest()
        #super().__setattr__(name, value)
