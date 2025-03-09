# path/to/models/user.py
from mongoengine import Document, StringField, DateTimeField
from datetime import datetime, timezone
    

class Docs(Document):
    created_at = DateTimeField(default=datetime.now(timezone.utc))
    updated_at = DateTimeField(default=datetime.now(timezone.utc))
    name = StringField(required=True)
    business_id = StringField(required=True)
    created_by = StringField(required=True)
    status = StringField(required=True)
    version = StringField(required=True)

    meta = {
        'indexes': [
            {
                'fields': ['business_id', 'name'],
                'unique': True
            }
        ]
    }

    @classmethod
    def create_document(cls, name, business_id, created_by, status, version):
        # Assertions to validate input fields
        assert isinstance(name, str) and name, "Name must be a non-empty string."
        assert isinstance(business_id, str) and business_id, "Business ID must be a non-empty string."
        assert isinstance(created_by, str) and created_by, "Created by must be a non-empty string."
        assert isinstance(status, str) and status, "Status must be a non-empty string."
        assert isinstance(version, str) and version, "Version must be a non-empty string."
        
        # Create and return the document
        document = cls(
            name=name,
            business_id=business_id,
            created_by=created_by,
            status=status,
            version=version
        )
        document.save()
        return document
    
    @classmethod
    def get_documents_by_business_id(cls, business_id):
        # Retrieve all documents with the specified business_id
        return cls.objects(business_id=business_id)
    
    @classmethod
    def get_document_by_business_id_and_document_id(cls, business_id, document_id):
        # Retrieve all documents with the specified business_id
        return cls.objects(business_id=business_id, id=document_id)[0]
    
    @classmethod
    def update_document_timestamp_to_now(cls, document_id):
        return cls.objects(id=document_id).update(set__updated_at=datetime.now(timezone.utc))
    
    def to_json(self):
        return {
            "id": str(self.id),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "name": self.name,
            "business_id": self.business_id,
            "created_by": self.created_by,
            "status": self.status,
            "version": self.version
        }