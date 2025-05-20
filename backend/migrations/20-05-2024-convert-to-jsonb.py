"""update shared_with column type

Revision ID: 20-05-2024-convert-to-jsonb
Revises: N/A
Create Date: 2024-05-20

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

def upgrade():
    # Convert existing string array to JSONB array
    op.execute("""
        ALTER TABLE documents 
        ALTER COLUMN shared_with TYPE JSONB[] 
        USING array_agg(jsonb_build_object('email', email, 'access', 'view'))
        FROM unnest(shared_with) email;
    """)

def downgrade():
    # Convert back to string array if needed
    op.execute("""
        ALTER TABLE documents 
        ALTER COLUMN shared_with TYPE VARCHAR(255)[]
        USING array_agg(value->>'email')
        FROM unnest(shared_with) value;
    """)