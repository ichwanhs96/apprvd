from models.document import Docs
from services.content import ContentService
from services.comment import CommentService
import json

from mongoengine import NotUniqueError

class DocumentService():
    def create_document_with_content_and_comment(name, business_id, created_by, status, version, contents):
        try:
            created_document = Docs.create_document(name, business_id, created_by, status, version)
            created_contents = ContentService.create_content(document_id=str(created_document.id), contents=contents)
            created_comments = CommentService.create_comment(document_id=str(created_document.id), comments=[])

            return json.dumps({ "document": created_document.to_json(), "contents": created_contents, "comments": created_comments })
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
        
    def get_document_by_business_id_and_document_id(business_id, document_id):
        try:
            document = Docs.get_document_by_business_id_and_document_id(business_id=business_id, document_id=document_id)
            contents = ContentService.get_contents_by_document_id(document_id=document_id)
            comments = CommentService.get_comments_by_document_id(document_id=document_id)
            return { "document": document.to_json(), "contents": contents, "comments": comments }  # Changed to a dictionary
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def update_document_timestamp_to_now(document_id):
        try:
            Docs.update_document_timestamp_to_now(document_id=document_id)
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def finalize_document(business_id, document_id):
        try:
            Docs.finalize_document(business_id=business_id, document_id=document_id)
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
        
    def delete_document(business_id, document_id):
        try:
            Docs.delete_document(business_id=business_id, document_id=document_id)
        except Exception as e:
            raise {"error_code": "SERVER_ERROR", "error_message": str(e)}
