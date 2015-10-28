from cloudmind import db


class Participant(db.Model):
    __tablename__ = 'participant'
    id = db.Column(db.Integer, primary_key=True)
    is_accepted = db.Column(db.Boolean, default=False)
    own_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # relationship
    own_node = db.relationship('Node')
    user = db.relationship('User', primaryjoin='Participant.user_id == User.id')
    from_user = db.relationship('User', primaryjoin='Participant.from_user_id == User.id')

    def __repr__(self):
        return '<Participant %r>' % self.id
