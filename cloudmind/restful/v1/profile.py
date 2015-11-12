from cloudmind.blueprint import apiv1
from cloudmind import db
from cloudmind.model.user import User
from flask import current_app
from flask import redirect
from flask import request
from flask import send_file
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json
import magic
import os
import time
from urllib.parse import quote
import uuid
from werkzeug import secure_filename


@apiv1.route('/profile/img/<int:user_id>')
def profile_download(user_id):
    user = db.session.query(User).filter(User.id == user_id).first()
    if user is None:
        return "Not found {}".format("User")
    if user.picture[0:4] == 'http':
        return redirect(user.picture)
    else:
        return send_file(
            user.picture,
            as_attachment=True,
            attachment_filename=quote(user.name),
            mimetype=magic.from_file(user.picture, mime=True).decode('utf-8')
        )


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
            'success': True,
            'profile': user.serialize
        }


class ProfileUpload(Resource):
    def post(self):
        if 'user_id' not in session:
            abort(403, message="already logged out")

        user_picture = request.files['user_picture']

        filename = secure_filename(str(int(time.time() * 1000))+'_'+uuid.uuid4().hex)
        filepath = os.path.join(current_app.config['UPLOAD_DIR'], filename)
        user_picture.save(filepath)

        mimetype = magic.from_file(filepath, mime=True)

        if mimetype[0:5] != b'image':
            abort(403, message="이미지파일이 아닙니다. : {0}".format(mimetype))

        user = db.session.query(User).filter(User.id == session['user_id']).first()
        user.picture = filepath
        db.session.commit()

        return {
            'success': True,
            'profile': user.serialize
        }


class ProfileSearch(Resource):
    def get(self):
        email = request.args.get('email', '')
        name = request.args.get('name', '')

        users_query = User.query
        not_null_filters = []
        if email != '':
            not_null_filters.append(User.email.like('{0}%'.format(email)))
        if name != '':
            not_null_filters.append(User.name.like('%{0}%'.format(name)))

        if len(not_null_filters) > 0:
            users_query = users_query.filter(db.or_(*not_null_filters))
            users_serialize = [i.serialize for i in users_query.all()]
        else:
            users_serialize = []

        return {
            'success': True,
            'profile': users_serialize
        }
