from cloudmind import db
from cloudmind.model.user import User
from flask import request
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json


class Profile(Resource):
    def get(self):
        if 'user_id' not in session:
            abort(403, message="already logged out")
        user = db.session.query(User).filter(User.id == session['user_id']).first()
        return {
            'success': True,
            'profile': user.serialize
        }

    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        name = args['name']
        if 'user_id' not in session:
            abort(403, message="already logged out")
        user = db.session.query(User).filter(User.id == session['user_id']).first()
        user.name = name
        db.session.commit()
        return {
            'success': True
        }


class ProfileUpload(Resource):
    def post(self):
        return {
            'success': True
        }


class ProfileSearch(Resource):
    def get(self):
        email = request.args.get('email')
        name = request.args.get('name')
        user = db.session.query(User).\
            filter(db.or_(User.name == name, User.email == email))\
            .first()
        return {
            'success': True,
            'profile': user.serialize
        }
        return {}
