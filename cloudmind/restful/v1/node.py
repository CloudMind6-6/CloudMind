from cloudmind import db
from cloudmind.model.label_palette import LabelPalette
from cloudmind.model.node import Node
from cloudmind.model.participant import Participant
from cloudmind.model.user import User
from dateutil import parser as date_parser
from flask import request
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json


class NodeList(Resource):
    def get(self):
        root_id = request.args.get('root_idx')

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
        node_name = args.get('node_name', None)
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
            if parent_node_id is None:
                abort(404, message="일반 노드에서 parent_node_id는 필수입니다.")
            root_node = db.session.query(Node).filter(Node.id == root_id).first()
            if root_node is None:
                abort(404, message="Not found {}".format("root_node"))
            if root_node.check_member(session['user_id']) is False:
                abort(404, message="노드멤버 아님")
        creator = User.query.filter(User.id == session['user_id']).first()

        node = Node(name=node_name, description=description)
        if root_id is not None:
            node.root_node = root_node
        else:
            node.root_node = node

        if parent_node_id is not None:
            node.parent_node = parent_node
        node.creator = creator
        db.session.add(node)
        db.session.commit()

        # 루트노드 일 경우에만 맴버로 등록 후 기본 팔레트 추가
        if root_id is None:
            participant = Participant(is_accepted=True)
            participant.is_accepted = True
            participant.own_node = node
            participant.user = creator
            participant.from_user = creator
            db.session.add(participant)
            db.session.commit()

            colors = [
                0x61bd4f,
                0xf2d600,
                0xffab4a,
                0xeb5a46,
                0xc377e0,
                0x0079bf,
                0xff80ce,
                0x4d4d4d
            ]
            for color in colors:
                palette = LabelPalette(root_node_id=node.id, color=color)
                db.session.add(palette)
                db.session.commit()

        nodes = db.session.query(Node).filter(Node.root_node_id == root_id).all()
        return {
            "success": True,
            "node": node.serialize,
            "user": node.serialize_member_detail,
            'node_list': [i.serialize for i in nodes]
        }


class NodeRemove(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        node_id = args['node_idx']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        node = db.session.query(Node).filter(Node.id == node_id).first()
        if node is None:
            abort(404, message="Not found {}".format("Node"))

        root_node = node.root_node
        if root_node is None:
            abort(404, message="Not found {}".format("root_node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        node.remove_all()

        nodes = db.session.query(Node).filter(Node.root_node_id == root_node.id).all()
        return {
            'success': True,
            'node_list': [i.serialize for i in nodes]
            }


class NodeUpdate(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        node_id = args['node_idx']
        node_name = args['node_name']
        description = args['description']
        due_date = date_parser.parse(args['due_date'])
        users = args['assigned_users']

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

        db.session.query(Participant).filter(Participant.own_node_id == node_id).delete()
        for user_id in users:
            participant = Participant(
                is_accepted=True,
                own_node_id=node_id,
                user_id=user_id,
                from_user_id=session['user_id']
            )
            db.session.add(participant)
            pass

        db.session.commit()

        nodes = db.session.query(Node).filter(Node.root_node_id == root_node.id).all()
        return {
            "success": True,
            'node_list': [i.serialize for i in nodes]
        }
