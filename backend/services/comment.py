from models.comment import Comment

class CommentService():
    def create_comment(document_id, comments):
        return Comment.create_comment(document_id, comments).to_plate_editor_format()
    
    def get_comments_by_document_id(document_id):
        try:
            result = Comment.get_comments_by_document_id(document_id)
            return result[0].comments
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def update_comment_by_document_id(document_id, comments):
        try:
            result = Comment.objects(document_id=document_id).update(set__comments=comments)
            if result == 0:
                raise {"error_code": "NOT_FOUND", "error_message": "Comment not found"}
            return {"success": True, "message": "Comment updated successfully"}
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}