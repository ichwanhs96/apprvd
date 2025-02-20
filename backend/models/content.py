from models.document import Docs

from mongoengine import Document, StringField, LazyReferenceField, DictField, ListField

class Content(Document):
    document_id = LazyReferenceField(Docs)
    styling = DictField(required=True)
    content_id = StringField(required=True)
    contents = ListField(DictField(required=True))

    @classmethod
    def create_content(cls, document_id, styling, content_id, contents):
        # Assertions to validate input parameters
        assert isinstance(document_id, str), "document_id must be a string"
        assert isinstance(styling, dict), "styling must be a dictionary"
        assert isinstance(content_id, str), "content_id must be a string"
        assert isinstance(contents, list), "contents must be a list"
        
        new_content = cls(
            document_id=document_id,
            styling=styling,
            content_id=content_id,
            contents=contents
        )
        new_content.save()
        return new_content
    
    @classmethod
    def get_contents_by_document_id(cls, document_id):
        return cls.objects(document_id=document_id)
    
    def to_json(self):
        return {
            "id": str(self.id),
            "document_id": str(self.document_id),
            "styling": self.styling,
            "content_id": self.content_id,
            "contents": self.contents
        }
    
    def to_plate_editor_format(self):
        result = {
            "id": self.content_id,
            "children": self.contents
        }

        for key, value in self.styling.items(): 
            result[key] = value

        return result