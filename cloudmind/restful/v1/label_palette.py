from cloudmind import db
from cloudmind.model.label_palette import LabelPalette
from cloudmind.model.node import Node
from flask import request
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json


class PaletteList(Resource):
    def get(self):
        root_id = request.args.get('root_idx')

        if 'user_id' not in session:
            abort(403, message="already logged out")

        root_node = db.session.query(Node).filter(Node.id == root_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        palettes = db.session.query(LabelPalette).filter(LabelPalette.root_node_id == root_id).all()
        return {
            'success': True,
            'label_palette_list': [i.serialize for i in palettes]
            }


class PaletteAdd(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        root_id = args['root_idx']
        name = args['name']
        color = args['color']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        root_node = db.session.query(Node).filter(Node.id == root_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        palettes = db.session.query(LabelPalette).filter(LabelPalette.root_node_id == root_id).all()
        if len(palettes) >= 8:
            abort(400, message="필레트 8개보다 많음")

        palette = LabelPalette(root_node_id=root_id, name=name, color=color)
        db.session.add(palette)
        db.session.commit()
        return {
            "success": True,
            "palette": palette.serialize
        }


class PaletteRemove(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        palette_id = args['id']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        palette = db.session.query(LabelPalette).filter(LabelPalette.id == palette_id).first()
        if palette is None:
            abort(404, message="Not found {}".format("Palette"))

        root_node = db.session.query(Node).filter(Node.id == palette.root_node_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        db.session.delete(palette)
        db.session.commit()
        return {"success": True}


class PaletteUpdate(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        palette_id = args['id']
        name = args['name']
        color = args['color']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        palette = db.session.query(LabelPalette).filter(LabelPalette.id == palette_id).first()
        if palette is None:
            abort(404, message="Not found {}".format("Palette"))

        root_node = db.session.query(Node).filter(Node.id == palette.root_node_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        palette.name = name
        palette.color = color
        db.session.commit()
        return {"success": True}
