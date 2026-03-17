schema_definitions = {
    "User": {
        "type": "object",
        "properties": {
            "id": {"type": "string", "example": "uuid-123"},
            "name": {"type": "string", "example": "John Doe"},
            "email": {"type": "string", "example": "john@example.com"},
            "created_at": {"type": "string", "example": "2026-03-16T18:16:17.596215"},
            "updated_at": {"type": "string", "example": "2026-03-16T18:16:17.596258"},
            "__class__": {"type": "string", "example": "User"}
        }
    },
    "UserUpdate": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "example": "Jane Doe"},
            "password": {"type": "string", "example": "newsecurepassword123"}
        }
    },
    "Exam": {
        "type": "object",
        "properties": {
            "id": {"type": "string", "example": "exam-uuid-456"},
            "school_name": {"type": "string", "example": "University of Lagos"},
            "location": {"type": "string", "example": "Ojo, Lagos"},
            "subject_name": {"type": "string", "example": "Advanced Physics"},
            "session": {"type": "string", "example": "2025/2026"},
            "semester": {"type": "string", "example": "First"},
            "class_or_level": {"type": "string", "example": "400 Level"},
            "course_code": {"type": "string", "example": "PHY401"},
            "time_allocated": {"type": "string", "example": "2 Hours"},
            "department_name": {"type": "string", "example": "Science"},
            "date": {"type": "string", "format": "date", "example": "2026-06-15"},
            "created_at": {"type": "string", "example": "2026-03-17T10:00:00.000000"},
            "updated_at": {"type": "string", "example": "2026-03-17T12:00:00.000000"},
            "__class__": {"type": "string", "example": "Exam"}
        }
    },
    "PasswordUpdate": {
        "type": "object",
        "properties": {
            "old_password": {"type": "string", "example": "current_pass_123"},
            "new_password": {"type": "string", "example": "new_awesome_pass_456"}
        },
        "required": ["old_password", "new_password"]
    }
}
