from cloudmind import db


class LabelPalette(db.Model):
    __tablename__ = 'label_palette'
    id = db.Column(db.Integer, primary_key=True)
    palette_number = db.Column(db.Integer)
    color = db.Column(db.Integer)
    name = db.Column(db.String(20))
    root_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    # relationship
    root_node = db.relationship('Node')

    def __repr__(self):
        return '<LabelPalette %r>' % self.id
