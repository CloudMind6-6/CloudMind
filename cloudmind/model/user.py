from cloudmind import db
import datetime


class User(db.Model):
    __tablename__ = 'user'
    METHOD_GOOGLE = 0

    id = db.Column(db.Integer, primary_key=True)
    login_method = db.Column(db.Integer)
    oauth_id = db.Column(db.Integer)
    name = db.Column(db.Integer)
    email = db.Column(db.String(70), unique=True)
    picture = db.Column(db.String(150))
    creation_date = db.Column(db.Date, default=datetime.date.today())

    def __init__(self, login_method, oauth_id, name, email, picture):
        self.login_method = login_method
        self.oauth_id = oauth_id
        self.name = name
        self.email = email
        self.picture = picture

    def __repr__(self):
        return '<User %r>' % self.email
