from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
# initialize without metadata filter
from llama_index.core import StorageContext
import os

from llama_index.core import get_response_synthesizer
from llama_index.core.query_engine import RetrieverQueryEngine

from llama_index.core.vector_stores import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
)


os.environ["PINECONE_API_KEY"] = "PINECONE_API_KEY"
os.environ["OPENAI_API_KEY"] = "OPENAI_API_KEY"

if "OPENAI_API_KEY" not in os.environ:
    raise EnvironmentError(f"Environment variable OPENAI_API_KEY is not set")

api_key = os.environ["PINECONE_API_KEY"]

pc = Pinecone(os.environ["PINECONE_API_KEY"])
pinecone_index = pc.Index("apprvd")

def query(prompt: str) -> str:
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)

    filters = MetadataFilters(
        filters=[
            MetadataFilter(
                key="document_id", operator=FilterOperator.EQ, value="157a6217-bee3-446f-a282-2dcc411ebbd6"
            ),
        ]
    )

    retriever = VectorStoreIndex.from_vector_store(vector_store).as_retriever(
        similarity_top_k=1,
        filters=filters
    )

    # set Logging to DEBUG for more detailed outputs
    # query_engine = index.as_query_engine()
    # response = retriever.retrieve("What did the author do growing up?")

    response_synthesizer = get_response_synthesizer()
    vector_query_engine = RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=response_synthesizer,
    )
    # response = query_engine.query("What did the author do growing up?")

    response = vector_query_engine.query(
        prompt
    )

    print(response)
    return response


def indexer(document_path: str):
    # load documents
    documents = SimpleDirectoryReader(document_path).load_data()

    if "OPENAI_API_KEY" not in os.environ:
        raise EnvironmentError(f"Environment variable OPENAI_API_KEY is not set")

    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context
    )

query("give me key items of apprvd privacy policy")