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

load_dotenv()

app = Flask(__name__)
CORS(app)

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

    chat_engine = VectorStoreIndex.from_vector_store(vector_store).as_chat_engine(chat_mode="openai", llm=llm, verbose=True)

    response = chat_engine.chat(prompt)

    print(response.response)

    return response.response