from cloudmind import db
import datetime
import mimetypes


class Leaf(db.Model):
    __tablename__ = 'leaf'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    creation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    file_path = db.Column(db.Text)
    file_type = db.Column(db.String(50))
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    parent_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    root_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    # relationship
    creator = db.relationship('User')
    root_node = db.relationship('Node', primaryjoin='Leaf.root_node_id == Node.id')
    parent_node = db.relationship(
        'Node', primaryjoin='Leaf.parent_node_id == Node.id', backref=db.backref('leafs', order_by=id)
    )

    def __init__(self, name, file_path):
        self.name = name
        self.file_path = file_path
        self.file_type = mimetypes.guess_type(name)[0]

    def __repr__(self):
        return '<Leaf %r>' % self.name

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'creation_date': self.creation_date.isoformat(),
            'file_type': self.file_type,
            'creator_id': self.creator_id,
            'parent_node_id': self.parent_node_id
        }
