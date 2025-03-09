from mongoengine import Document, LazyReferenceField, DictField, ListField, DateTimeField
from datetime import datetime, timezone

class ContentHistory(Document):
    content_id = LazyReferenceField('Content')
    content = ListField(DictField(required=True))
    created_at = DateTimeField(default=datetime.now(timezone.utc))

    def to_json(self):
        return {
            "id": str(self.id),
            "content_id": str(self.content_id),
            "content": self.previous_state,
            "created_at": self.created_at.isoformat()
        }