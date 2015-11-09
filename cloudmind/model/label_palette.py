from cloudmind import db


class LabelPalette(db.Model):
    __tablename__ = 'label_palette'
    id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.Integer)
    name = db.Column(db.String(20), default='')
    root_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    # relationship
    root_node = db.relationship('Node')

    def __repr__(self):
        return '<LabelPalette %r>' % self.id

    @property
    def serialize(self):
        return {
            'palette_idx': self.id,
            'color': self.color,
            'name': self.name,
            'root_idx': self.root_node_id
        }
