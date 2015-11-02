# -*- coding: utf-8 -*-
from cloudmind.blueprint import apiv1
from cloudmind.config.config import Config
from flask import Flask
from flask import jsonify
from flask import redirect
from flask import request
from flask import session
from flask import url_for
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = 'development'
app.config.from_object(Config)

db = SQLAlchemy(app)

api = Api(apiv1)
from cloudmind.restful.v1 import label
from cloudmind.restful.v1 import label_palette
from cloudmind.restful.v1 import leaf
from cloudmind.restful.v1 import node
from cloudmind.restful.v1 import profile
from cloudmind.restful.v1 import root

api.add_resource(label.LabelAdd, '/label/add')
api.add_resource(label.LabelRemove, '/label/remove')
api.add_resource(label_palette.PaletteList, '/label_palette/list')
api.add_resource(label_palette.PaletteAdd, '/label_palette/add')
api.add_resource(label_palette.PaletteRemove, '/label_palette/remove')
api.add_resource(label_palette.PaletteUpdate, '/label_palette/update')
api.add_resource(leaf.LeafUpload, '/leaf/upload')
api.add_resource(node.NodeList, '/node/list')
api.add_resource(node.NodeAdd, '/node/add')
api.add_resource(node.NodeRemove, '/node/remove')
api.add_resource(node.NodeUpdate, '/node/update')
api.add_resource(profile.Profile, '/profile')
api.add_resource(profile.ProfileUpload, '/profile/upload')
api.add_resource(profile.ProfileSearch, '/profile/search')
api.add_resource(root.RootList, '/root/list')
api.add_resource(root.RootInvite, '/root/invite')

# Blueprint Register
app.register_blueprint(apiv1)

from cloudmind.oauth import google


@app.route('/')
def index():
    if 'google_token' in session:
        userinfo = google.get('userinfo').data
        from cloudmind.model.user import User
        user = db.session.query(User).filter(User.oauth_id == userinfo['id']).first()
        session['user_id'] = user.id
        return jsonify({"data": user.serialize})
    return redirect(url_for('login'))


@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('google_token', None)
    return redirect(url_for('index'))


@app.route('/oauth2callback')
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['google_token'] = (resp['access_token'], '')
    userinfo = google.get('userinfo').data

    from cloudmind.model.user import User
    user = db.session.query(User).filter(User.oauth_id == userinfo['id']).first()

    """DB에 없다면 추가하기"""
    if user is None:
        user = User(
            login_method='google',
            oauth_id=userinfo['id'],
            name=(userinfo['given_name'] + ' ' + userinfo['family_name']),
            email=userinfo['email'],
            picture=userinfo['picture']
            )
        db.session.add(user)
        db.session.commit()
    session['user_id'] = user.id
    return jsonify({"data": user.serialize})


@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')


"""
@web.route('/')
def index():
    if 'user_idx' in session:
        return render_template('app.html')
    else:
        return render_template('intro.html')
"""
