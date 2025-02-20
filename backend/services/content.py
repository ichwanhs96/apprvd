from models.content import Content
# from models.comment import Comment

class ContentService():
    def create_content(document_id, styling, content_id, contents):
        return Content.create_content(document_id, styling, content_id, contents).to_plate_editor_format()
    
    def get_contents_by_document_id(document_id):
        try:
            contents = Content.get_contents_by_document_id(document_id)
            return [content.to_plate_editor_format() for content in contents]
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}