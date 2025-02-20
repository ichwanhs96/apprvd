from models.document import Docs
from services.content import ContentService
# from models.comment import Comment
import json

from mongoengine import NotUniqueError

class DocumentService():
    def create_document_with_content(name, business_id, created_by, status, version, contents):
        try:
            created_document = Docs.create_document(name, business_id, created_by, status, version)
            created_contents = []

            for content in contents:
                content_styling = {key: value for key, value in content.items() if key not in ["children", "id"]}
                created_contents.append(ContentService.create_content(document_id=str(created_document.id), content_id=content['id'], styling=content_styling, contents=content['children']))

            return json.dumps({ "document": created_document.to_json(), "contents": created_contents })
        except NotUniqueError as e:
            raise {"error_code": "DUPLICATE_DOCUMENT_ERROR", "error_message": "Document already exists!"}
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def get_document_by_business_id(business_id):
        try:
            documents = Docs.get_documents_by_business_id(business_id)
            return [doc.to_json() for doc in documents]  # Iterate and call to_json on each document
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}