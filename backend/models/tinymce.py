from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON, JSONB

db = SQLAlchemy()

# class User(db.Model):
#     __tablename__ = 'users'

#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(255))
#     name = db.Column(db.String(255))

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    business_id = db.Column(db.String(255))
    created_by = db.Column(db.String(255))
    language = db.Column(db.String(255), default="en")
    version = db.Column(db.String(255), default="1.0.0")
    status = db.Column(db.String(255), default="DRAFT")
    is_template = db.Column(db.Boolean, default=False)
    shared_with = db.Column(db.ARRAY(JSONB), default=[])
    
    # Relationship with comments
    comments = db.relationship('Comment', backref='document', lazy=True, cascade='all, delete-orphan')

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    conversation_uid = db.Column(db.String(255))  # TinyMCE conversation ID
    comment_uid = db.Column(db.String(255))      # Individual comment ID
    content = db.Column(db.Text)
    author = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    modified_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    author_avatar = db.Column(db.String(255))