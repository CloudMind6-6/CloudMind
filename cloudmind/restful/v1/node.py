from cloudmind import db
from cloudmind.model.node import Node
from cloudmind.model.user import User
from cloudmind.model.participant import Participant
from flask import request
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json


class NodeList(Resource):
    def get(self):
        root_id = request.args.get('root_id')

        if 'user_id' not in session:
            abort(403, message="already logged out")

        root_node = db.session.query(Node).filter(Node.id == root_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        nodes = db.session.query(Node).filter(Node.root_node_id == root_id).all()
        return {
            'success': True,
            'node_list': [i.serialize for i in nodes]
            }


class NodeAdd(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        root_id = args.get('root_idx', None)
        parent_node_id = args.get('parent_node_idx', None)
        node_name = args.get('nodename', None)
        description = args.get('description', None)

        if 'user_id' not in session:
            abort(403, message="already logged out")

        if parent_node_id is not None:
            parent_node = db.session.query(Node).filter(Node.id == parent_node_id).first()
            if parent_node is None:
                abort(404, message="Not found {}".format("parent_node"))
            if parent_node.check_member(session['user_id']) is False:
                abort(404, message="노드멤버 아님")

        if root_id is not None:
            root_node = db.session.query(Node).filter(Node.id == root_id).first()
            if root_node is None:
                abort(404, message="Not found {}".format("root_node"))
            if root_node.check_member(session['user_id']) is False:
                abort(404, message="노드멤버 아님")
        creator = User.query.filter(User.id == session['user_id']).first()

        node = Node(name=node_name, description=description)
        if root_id is not None:
            node.root_node = root_node
        if parent_node_id is not None:
            node.parent_node = parent_node
        node.creator = creator
        db.session.add(node)
        db.session.commit()

        participant = Participant(is_accepted=True)
        participant.own_node = node
        participant.user = creator
        participant.from_user = creator
        db.session.add(participant)
        db.session.commit()

        return {"success": True}


class NodeRemove(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        node_id = args['id']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        node = db.session.query(Node).filter(Node.id == node_id).first()
        if node is None:
            abort(404, message="Not found {}".format("Node"))

        root_node = node.root_node
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        db.session.delete(node)
        db.session.commit()
        return {"success": True}


class NodeUpdate(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        node_id = args['id']
        node_name = args['node_name']
        description = args['description']
        due_date = args['due_date']
        #  users = args['assignedUser']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        node = db.session.query(Node).filter(Node.id == node_id).first()
        if node is None:
            abort(404, message="Not found {}".format("Node"))

        root_node = node.root_node
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        node.name = node_name
        node.description = description
        node.due_date = due_date

        db.session.add(node)
        db.session.commit()
        return {"success": True}
