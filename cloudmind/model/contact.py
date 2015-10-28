from cloudmind import db


class Contact(db.Model):
    __tablename__ = 'contact'
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # relationship
    from_user = db.relationship('User', primaryjoin='Contact.from_user_id == User.id')
    to_user = db.relationship('User', primaryjoin='Contact.to_user_id == User.id')

    def __repr__(self):
        return '<Contact %r>' % self.id
