# -*- coding: utf-8 -*-
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
api = Api(app)
from cloudmind.oauth import google


@app.route('/')
def index():
    if 'google_token' in session:
        me = google.get('userinfo')
        return jsonify({"data": me.data})
    return redirect(url_for('login'))


@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))


@app.route('/logout')
def logout():
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
    me = google.get('userinfo')
    return jsonify({"data": me.data})


@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')


"""
@app.route('/')
def index():
    if 'user_idx' in session:
        return render_template('app.html')
    else:
        return render_template('intro.html')
"""
