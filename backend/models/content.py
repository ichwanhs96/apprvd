from models.document import Docs
from models.content_history import ContentHistory
from datetime import datetime, timezone

from mongoengine import Document, LazyReferenceField, DictField, ListField

class Content(Document):
    document_id = LazyReferenceField(Docs)
    # styling = DictField(required=True)
    # content_id = StringField(required=True)
    contents = ListField(DictField(required=True))

    @classmethod
    def create_content(cls, document_id, contents):
        # Assertions to validate input parameters
        assert isinstance(document_id, str), "document_id must be a string"
        # assert isinstance(styling, dict), "styling must be a dictionary"
        # assert isinstance(content_id, str), "content_id must be a string"
        assert isinstance(contents, list), "contents must be a list"
        
        new_content = cls(
            document_id=document_id,
            # styling=styling,
            # content_id=content_id,
            contents=contents
        )
        new_content.save()
        return new_content
    
    @classmethod
    def get_contents_by_document_id(cls, document_id):
        return cls.objects(document_id=document_id)
    
    @classmethod
    def update_content_by_document_id(cls, document_id, contents):
        try:
            content = cls.get_contents_by_document_id(document_id)[0]
            if content:
                # Record the previous state before updating
                previous_content = content.contents
                content_history = ContentHistory(
                    content_id=content.id,
                    content=previous_content
                )
                content_history.save()  # Save the previous content to history

                # Update the content
                content.contents = contents
                content.save()
                document = content.document_id.fetch()  # Load the referenced document
                document.updated_at = datetime.now(timezone.utc)
                document.save()
                return content.to_plate_editor_format()
            else:
                raise {"error_code": "NOT_FOUND", "error_message": "Content not found"}
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
    
    def to_json(self):
        return {
            "id": str(self.id),
            "document_id": str(self.document_id),
            # "styling": self.styling,
            # "content_id": self.content_id,
            "contents": self.contents
        }
    
    def to_plate_editor_format(self):
        return self.contents