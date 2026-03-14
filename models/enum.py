#!/usr/bin/python3
"""
Declare enums used in database
"""
import enum


# class ItemType(enum.Enum):
#     """ enumerate different item types"""
#     ROBUST = 'robust'
#     FRAGILE = 'fragile'
#     PERISHABLE = 'perishable'
# 
# 
# class UserType(enum.Enum):
#     """Declare an enum class for the user types"""
#     REGULAR = 'regular'
#     ADMIN = 'admin'

class QueryType(enum.Enum):
    """Enumerate different query types"""
    OBJECTIVE = 'objective'
    THEORY = 'theory'
