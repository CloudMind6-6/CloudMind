from cloudmind import db


class Label(db.Model):
    __tablename__ = 'label'
    id = db.Column(db.Integer, primary_key=True)
    own_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    palette_id = db.Column(db.Integer, db.ForeignKey('label_palette.id'))
    # relationship
    own_node = db.relationship('Node', backref="labels")
    palette = db.relationship('LabelPalette')

    def __repr__(self):
        return '<Label %r>' % self.id

    @property
    def serialize(self):
        return self.palette_id
