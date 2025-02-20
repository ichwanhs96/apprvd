# from mongoengine import Document, StringField, DateTimeField, LazyReferenceField
# from datetime import datetime

# class Comment(Document):
#     document_id = LazyReferenceField('docs')
#     created_at = DateTimeField(default=datetime.utcnow)
#     updated_at = DateTimeField(default=datetime.utcnow)
#     parent_id = StringField(required=True)
#     text = StringField(required=True)
#     user_id = StringField(required=True)
#     status = StringField(required=True)