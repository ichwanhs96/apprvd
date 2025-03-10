# save this as app.py
from flask import Flask, request, jsonify
from flask_cors import CORS 
# import docx

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
# initialize without metadata filter
from llama_index.core import StorageContext

from llama_index.core import get_response_synthesizer
from llama_index.core.query_engine import RetrieverQueryEngine

from llama_index.core.vector_stores import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
)

from llama_index.llms.openai import OpenAI

import os
import hashlib
import json

from dotenv import load_dotenv

from mongoengine import connect

load_dotenv()

# Connect to MongoDB
connect(
    db=os.environ['DB_NAME'],
    host=os.environ['DB_HOST'],
    port=int(os.environ['DB_PORT']),
    username=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD']
)

app = Flask(__name__)
CORS(app)

LEGAL_EU_SYSTEM_PROMPT = """\
• You are a legal chatbot specialized in providing assistance and information on European regulations, with a particular focus on data protection laws such as GDPR.
• Provide concise replies that are polite and professional.
• Answer questions truthfully based on official European Union regulations and directives. Tailor your responses considering the context provided below about key regulations such as GDPR, ePrivacy Directive, and other relevant laws.
• Do not answer questions that are unrelated to European legal regulations and respond with "I can only help with questions related to European regulations."
• If you do not know the answer to a question, respond by saying “I do not know the answer to your question. You may be able to find your answer at https://ec.europa.eu/info/law/law-topic/data-protection_en”

Core Topics Related to European Legal Regulations:
• General Data Protection Regulation (GDPR): Outlines the key principles of data protection, data subject rights, and the obligations of data controllers and processors. Emphasizes transparency, data minimization, and the need for data breach notifications.
• ePrivacy Directive: Covers rules on electronic communications data, including consent requirements for cookies and marketing communications.
• Data Protection Impact Assessments (DPIA): Required for processing activities that may result in high risks to the rights and freedoms of individuals.
• Cross-Border Data Transfers: The requirements for transferring personal data outside of the EEA (European Economic Area), including Standard Contractual Clauses (SCCs) and the adequacy decisions.
• Data Subject Rights: Including the right to access, rectify, erase personal data, and the right to data portability.
• Data Breach Notifications: The obligation of notifying the relevant supervisory authority and data subjects within 72 hours of becoming aware of a data breach.
• Penalties and Enforcement: Outlines the consequences of non-compliance, which can include significant fines and other sanctions.

Examples of Common Questions:
• What are the primary responsibilities of a Data Controller under GDPR?
• How can a company ensure it is compliant with the ePrivacy Directive when it comes to cookie consent?
• What steps should be taken if a data breach occurs?
• What rights do individuals have regarding their personal data?
• What are the legal requirements for transferring personal data to a non-EU country?

I am here to help you navigate the complexities of European legal regulations. How can I assist you today?
"""

LEGAL_SYSTEM_PROMPT = """\
• You are a legal chatbot specialized in providing assistance and information on general legal regulations, with a particular focus on data protection laws.
• Provide concise replies that are polite and professional.
• Answer questions truthfully based on official regulations and legal principles. Tailor your responses considering the context provided below about key regulations such as data protection laws, privacy laws, and other relevant legal topics.
• Do not answer questions that are unrelated to legal regulations and respond with "I can only help with questions related to legal regulations."
• If you do not know the answer to a question, respond by saying “I do not know the answer to your question. You may want to consult a legal professional for more detailed information.”

Core Topics Related to Legal Regulations:
• Data Protection Laws: Key principles of data protection, data subject rights, and the obligations of data controllers and processors. Emphasizes transparency, data minimization, and data breach notifications.
• Privacy Laws: Rules on electronic communications data, including consent requirements for cookies and marketing communications.
• Data Protection Impact Assessments (DPIA): Necessary for processing activities that may result in high risks to the rights and freedoms of individuals.
• Cross-Border Data Transfers: The requirements for transferring personal data outside of a particular region, including specific contractual clauses and adequacy decisions.
• Data Subject Rights: Including the right to access, rectify, erase personal data, and the right to data portability.
• Data Breach Notifications: The obligation of notifying the relevant supervisory authority and data subjects within a specified timeframe of becoming aware of a data breach.
• Penalties and Enforcement: Consequences of non-compliance, which can include significant fines and other sanctions.

Examples of Common Questions:
• What are the primary responsibilities of a Data Controller under data protection laws?
• How can a company ensure it is compliant with privacy laws when it comes to cookie consent?
• What steps should be taken if a data breach occurs?
• What rights do individuals have regarding their personal data?
• What are the legal requirements for transferring personal data to a different country?

I am here to help you navigate the complexities of legal regulations. How can I assist you today?
"""

# requirements
# determine regulations countries -> contextualize system prompt LLM with country specific prompt

@app.route("/")
def hello():
    return "Hello, World!"

@app.route("/uploads", methods=['POST'])
def upload():
    # received pdf only and store in /data folder in the same where the app script run
    # return file name, file size and checksum
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.lower().endswith('.pdf'):
        # Create data folder if it doesn't exist
        data_folder = os.path.join(os.path.dirname(__file__), 'data')
        os.makedirs(data_folder, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(data_folder, file.filename)
        file.save(file_path)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Calculate checksum
        with open(file_path, "rb") as f:
            file_hash = hashlib.md5()
            chunk = f.read(8192)
            while chunk:
                file_hash.update(chunk)
                chunk = f.read(8192)
        
        checksum = file_hash.hexdigest()
        
        return jsonify({
            "filename": file.filename,
            "size": file_size,
            "checksum": checksum
        }), 200
    else:
        return jsonify({"error": "Only PDF files are allowed"}), 400

@app.route("/prompt", methods=['POST'])
def prompt():
    payload = request.get_json()  # Read JSON payload and convert to dict
    print(payload)
    print(payload.get("prompt"))
    response = query(payload.get("prompt"))  # Pass the payload to the query function
    return jsonify({"response": response }), 200

# @app.route("/documents")
# def documents():
#     current_dir = os.path.dirname(__file__)

#     document = docx.Document(current_dir + '/' + 'Example docs.docx') # open an existing document

#     print(document.paragraphs[5].text)
#     print(document.tables[0].cell(0,0).text)

#     p = document.tables[0].cell(0,0).add_paragraph('comment') # add a comment to a cell in a table
    
#     comment = p.add_comment('comment',author='Obay Daba',initials= 'od') # add a comment on the entire paragraph

#     paragraph1 = document.add_paragraph('text') # create new paragraph

#     comment = paragraph1.add_comment('comment',author='Obay Daba',initials= 'od') # add a comment on the entire paragraph

#     paragraph2 = document.add_paragraph('text') # create another paragraph

#     run = paragraph2.add_run('texty') # add a run to the paragraph

#     run.add_comment('comment') # add a comment only for the run text

#     paragraph1.add_footnote('footnote text') # add a footnote

#     document.save('new.docx') # save the document

#     return "Document Updated"

### LLM functions

if "OPENAI_API_KEY" not in os.environ:
    raise EnvironmentError(f"Environment variable OPENAI_API_KEY is not set")

if "PINECONE_API_KEY" not in os.environ:
    raise EnvironmentError(f"Environment variable PINECONE_API_KEY is not set")

pc = Pinecone(os.environ["PINECONE_API_KEY"])
pinecone_index = pc.Index("apprvd")

def query(prompt: str) -> str:
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)

    filters = MetadataFilters(
        filters=[
            # MetadataFilter(
            #     key="document_id", operator=FilterOperator.EQ, value="157a6217-bee3-446f-a282-2dcc411ebbd6"
            # ),
        ]
    )

    # retriever = VectorStoreIndex.from_vector_store(vector_store).as_retriever(
    #     similarity_top_k=1,
    #     filters=filters
    # )

    # response_synthesizer = get_response_synthesizer()
    # vector_query_engine = RetrieverQueryEngine(
    #     retriever=retriever,
    #     response_synthesizer=response_synthesizer,
    # )

    # response = vector_query_engine.query(
    #     prompt
    # )

    llm = OpenAI(model="gpt-4o")

    chat_engine = VectorStoreIndex.from_vector_store(vector_store).as_chat_engine(chat_mode="openai", llm=llm, verbose=True, system_prompt=LEGAL_SYSTEM_PROMPT)

    response = chat_engine.chat(prompt)

    print(response.response)

    return response.response


# endpoints definition for handling documents
# TODO: use proper auth strategy to authenticate and authorize user and determine business id

from services.document import DocumentService
from services.content import ContentService
from services.comment import CommentService

@app.route("/document", methods=['POST'])
def create_document():
    business_id = request.headers.get("business-id") 
    document_data = request.get_json()
    created_document = DocumentService.create_document_with_content_and_comment(business_id=business_id, **document_data)
    return created_document, 201

@app.route("/document", methods=['GET'])
def get_documents():
    business_id = request.headers.get("business-id") 
    documents = DocumentService.get_document_by_business_id(business_id=business_id)
    return documents, 200

@app.route("/document/<string:id>", methods=['GET'])
def get_document_by_id(id):
    business_id = request.headers.get("business-id") 
    document = DocumentService.get_document_by_business_id_and_document_id(business_id=business_id, document_id=id)
    return document, 200

@app.route("/document/<string:id>/content", methods=['GET'])
def get_document_with_content(id):
    business_id = request.headers.get("business-id") 
    contents = ContentService.get_contents_by_document_id(document_id=id)
    return contents, 200

@app.route("/document/<string:id>/content", methods=['PATCH'])
def update_document_content(id):
    business_id = request.headers.get("business-id") 
    payload = request.get_json()
    updated_content = ContentService.update_content_by_document_id(document_id=id, contents=payload)
    return updated_content, 200

@app.route("/document/<string:id>/comment", methods=['PATCH'])
def update_document_comment(id):
    business_id = request.headers.get("business-id") 
    payload = request.get_json()
    updated_comments = CommentService.update_comment_by_document_id(document_id=id, comments=payload)
    return updated_comments, 200

@app.route("/document/<string:id>/finalize", methods=['PATCH'])
def finalize_document(id):
    business_id = request.headers.get("business-id") 
    DocumentService.finalize_document(business_id=business_id, document_id=id)
    return { 'status': 'ok' }, 200

@app.route("/document/<string:id>", methods=['DELETE'])
def delete_document(id):
    business_id = request.headers.get("business-id") 
    DocumentService.delete_document(business_id=business_id, document_id=id)
    return { 'status': 'ok' }, 200

# @app.route("/document/<string:id>/comment", methods=['POST'])
# def add_comment(id):
#     # Logic to add a new comment to the document
#     comment_data = request.get_json()
#     # Save comment_data to the database associated with document id
#     return jsonify({"message": f"Comment added to document {id} successfully"}), 201

# @app.route("/document/<string:doc_id>/comment/<string:comment_id>/resolve", methods=['POST'])
# def resolve_comment(doc_id, comment_id):
#     # Logic to resolve a comment
#     # Update the comment status in the database
#     return jsonify({"message": f"Comment {comment_id} on document {doc_id} resolved successfully"}), 200

# @app.route("/document/<string:doc_id>/comment/<string:comment_id>", methods=['PATCH'])
# def edit_comment(doc_id, comment_id):
#     # Logic to edit a comment
#     comment_data = request.get_json()
#     # Update the comment in the database
#     return jsonify({"message": f"Comment {comment_id} on document {doc_id} updated successfully"}), 200

# @app.route("/document/<string:id>/ai/review", methods=['POST'])
# def generate_review(id):
#     # Logic to generate a review based on the document
#     # Example: Use AI model to generate a review and save it as a comment
#     return jsonify({"message": f"Review generated for document {id} successfully"}), 201

# # Create a new user
# @app.route('/users', methods=['POST'])
# def create_user():
#     data = request.json
#     user = User(**data)
#     user.save()
#     return jsonify(user.to_json()), 201

# # Get all users
# @app.route('/users', methods=['GET'])
# def get_users():
#     users = User.objects()
#     return jsonify(users), 200