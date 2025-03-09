class ContentService():
    def create_content(document_id, contents):
        from models.content import Content
        return Content.create_content(document_id, contents).to_plate_editor_format()
    
    def get_contents_by_document_id(document_id):
        try:
            from models.content import Content
            from services.document import DocumentService
            result = Content.get_contents_by_document_id(document_id)
            DocumentService.update_document_timestamp_to_now(document_id=document_id)
            return result[0].contents
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def update_content_by_document_id(document_id, contents):
        try:
            from models.content import Content
            Content.update_content_by_document_id(document_id=document_id, contents=contents)
            return {"success": True, "message": "Content updated successfully"}
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}