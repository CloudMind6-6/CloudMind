from cloudmind import db
from cloudmind.model.label import Label
from cloudmind.model.node import Node
from flask import request
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json


class LabelAdd(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        node_id = args['node_idx']
        palette_id = args['palette_idx']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        own_node = db.session.query(Node).filter(Node.id == node_id).first()
        if own_node is None:
            abort(404, message="Not found {}".format("Node"))
        if own_node.check_member(session['user_id']):
            label = Label(own_node_id=node_id, palette_id=palette_id)
            db.session.add(label)
            db.session.commit()
            return {"success": True}
        else:
            abort(404, message="노드멤버 아님")


class LabelRemove(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        node_id = args['node_idx']
        palette_id = args['palette_idx']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        own_node = db.session.query(Node).filter(Node.id == node_id).first()
        if own_node is None:
            abort(404, message="Not found {}".format("Node"))
        if own_node.check_member(session['user_id']):
            db.session.query(Label).filter(Label.own_node_id == node_id).filter(Label.palette_id == palette_id).delete()
            db.session.commit()
            return {"success": True}
        else:
            abort(404, message="노드멤버 아님")
