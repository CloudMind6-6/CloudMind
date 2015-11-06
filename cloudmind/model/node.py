from cloudmind import db
from cloudmind.model.participant import Participant
from cloudmind.model.user import User
import datetime


class Node(db.Model):
    __tablename__ = 'node'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    creation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    due_date = db.Column(db.DateTime, default=None)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    root_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    parent_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    # relationship
    creator = db.relationship('User')
    root_node = db.relationship('Node', foreign_keys='Node.root_node_id')
    parent_node = db.relationship(
        'Node',
        backref=db.backref('child_nodes', order_by=id),
        foreign_keys='Node.parent_node_id',
        remote_side=[id]
        )
    # child_nodes = db.relationship('Node', backref="parent_node", foreign_keys='Node.parent_node_id')
    # leafs = db.relationship('Leaf', order_by="Leaf.id", backref="node")
    # members = db.relationship('User', secondary=Participant)

    def __repr__(self):
        return '<Node %r>' % self.name

    def check_member(self, user_id):
        if(db.session.query(Participant).
                filter(Participant.own_node_id == self.id).
                filter(Participant.user_id == user_id).
                filter(Participant.is_accepted is True)):
            return True
        else:
            return False

    @property
    def serialize(self):
        return {
            'node_idx': self.id,
            'name': self.name,
            'creation_date': self.creation_date.isoformat(),
            'due_date': self.due_date.isoformat() if self.due_date is not None else None,
            'description': self.description,
            'creator_id': self.creator_id,
            'rootidx': self.root_node_id,
            'parentidx': self.parent_node_id,
            'leafs': self.serialize_leafs,
            'assiendUser': self.serialize_member,
        }

    @property
    def serialize_leafs(self):
        return [item.serialize for item in self.leafs]

    @property
    def serialize_member(self):
        members = db.session.query(Participant).\
            filter(Participant.own_node_id == self.id).\
            all()
        return [item.user_id for item in members]

    @property
    def serialize_member_detail(self):
        members = db.session.query(Participant).\
            filter(Participant.own_node_id == self.id).\
            all()
        return [db.session.query(User).filter(User.id == item.user_id).first().serialize for item in members]

    @property
    def serialize_root(self):
        return {
            'node': self.serialize,
            'user': self.serialize_member_detail
        }

    def remove_childs(self):
        for item in self.child_nodes:
            item.remove_childs()
            db.session.delete(item)
