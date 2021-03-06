from cloudmind import db
from cloudmind.mail import mail_send_invite
from cloudmind.model.node import Node
from cloudmind.model.participant import Participant
from cloudmind.model.user import User
from flask import request
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json
from sqlalchemy.sql.expression import true


class RootList(Resource):
    def get(self):
        if 'user_id' not in session:
            abort(403, message="already logged out")
        participants = db.session.query(Participant).filter(Participant.user_id == session['user_id'])\
            .filter(Participant.is_accepted == true())\
            .all()
        node_list = []
        for item in participants:
            # if is root node
            if item.own_node.parent_node_id is None:
                node_list.append(item.own_node.serialize_root)
        return {
            'success':  True,
            "node_list": node_list
            }


class RootInvite(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        root_id = args['root_idx']
        email = args['email']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        root_node = db.session.query(Node).filter(Node.id == root_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        user = User.query.filter(User.email == email).first()
        from_user = User.query.filter(User.id == session['user_id']).first()
        if user is None:
            abort(404, message="Not found {}".format("User"))

        participant_check = db.session.query(Participant)\
            .filter(Participant.own_node_id == root_id)\
            .filter(Participant.user_id == user.id).first()
        if participant_check is not None:
            abort(403, message="이미 초대중이거나 멤버에 속해 있습니다.")

        participant = Participant()
        participant.is_accepted = False
        participant.own_node = root_node
        participant.user = user
        participant.from_user = from_user
        db.session.add(participant)
        db.session.commit()

        mail_send_invite(participant)

        return {
            'success':  True
            }
