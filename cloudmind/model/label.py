from cloudmind import db


class Label(db.Model):
    __tablename__ = 'label'
    id = db.Column(db.Integer, primary_key=True)
    own_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    palette_id = db.Column(db.Integer, db.ForeignKey('label_palette.id'))
    # relationship
    own_node = db.relationship('Node')
    palette = db.relationship('Node')

    def __repr__(self):
        return '<Label %r>' % self.id
