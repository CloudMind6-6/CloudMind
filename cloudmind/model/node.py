from cloudmind import db
import datetime


class Node(db.Model):
    __tablename__ = 'node'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    creation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    due_date = db.Column(db.DateTime)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    root_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    parent_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    # relationship
    creator = db.relationship('User')
    root_node = db.relationship('Node', primaryjoin='Node.root_node_id == Node.id')
    parent_node = db.relationship('Node', primaryjoin='Node.parent_node_id == Node.id')
    child_nodes = db.relationship("Node", backref="node", primaryjoin='Node.parent_node_id == Node.id')

    def __init__(self, name, due_date, description):
        self.name = name
        self.due_date = due_date
        self.description = description

    def __repr__(self):
        return '<Node %r>' % self.name
