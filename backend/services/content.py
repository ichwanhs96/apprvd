from models.content import Content
# from models.comment import Comment

class ContentService():
    def create_content(document_id, contents):
        return Content.create_content(document_id, contents).to_plate_editor_format()
    
    def get_contents_by_document_id(document_id):
        try:
            result = Content.get_contents_by_document_id(document_id)
            return result[0].contents
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def update_content_by_document_id(document_id, contents):
        try:
            result = Content.objects(document_id=document_id).update(set__contents=contents)
            if result == 0:
                raise {"error_code": "NOT_FOUND", "error_message": "Content not found"}
            return {"success": True, "message": "Content updated successfully"}
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}