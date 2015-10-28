from cloudmind import db
import datetime


class Leaf(db.Model):
    __tablename__ = 'leaf'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    creation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    file_path = db.Column(db.Text)
    file_type = db.Column(db.String(50))
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    parent_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    # relationship
    creator = db.relationship('User')
    parent_node = db.relationship('Node')

    def __init__(self, name, due_date, description):
        self.name = name
        self.due_date = due_date
        self.description = description

    def __repr__(self):
        return '<Leaf %r>' % self.name
