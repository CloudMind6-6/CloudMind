from cloudmind import db
from cloudmind.model.participant import Participant
from flask import session
from flask_restful import abort
from flask_restful import Resource


class RootList(Resource):
    def get(self):
        if 'user_id' not in session:
            abort(403, message="already logged out")
        participants = db.session.query(Participant).filter(Participant.user_id == session['user_id']).all()
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
        return {}
