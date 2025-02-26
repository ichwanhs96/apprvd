from models.document import Docs

from mongoengine import Document, LazyReferenceField, DictField, ListField

class Comment(Document):
    document_id = LazyReferenceField(Docs)
    comments = ListField(DictField(required=True))

    @classmethod
    def create_comment(cls, document_id, comments):
        # Assertions to validate input parameters
        assert isinstance(document_id, str), "document_id must be a string"
        assert isinstance(comments, list), "comments must be a list"
        
        new_content = cls(
            document_id=document_id,
            # styling=styling,
            # content_id=content_id,
            comments=comments
        )
        new_content.save()
        return new_content
    
    @classmethod
    def get_comments_by_document_id(cls, document_id):
        return cls.objects(document_id=document_id)
    
    def update_comments_by_document_id(document_id, contents):
        try:
            comment = Comment.get_comments_by_document_id(document_id)
            if comment:
                comment[0].comments = contents
                comment[0].save()
                return comment[0].to_plate_editor_format()
            else:
                raise {"error_code": "NOT_FOUND", "error_message": "Comment not found"}
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
    
    def to_json(self):
        return {
            "id": str(self.id),
            "document_id": str(self.document_id),
            "comments": self.comments
        }
    
    def to_plate_editor_format(self):
        return self.comments