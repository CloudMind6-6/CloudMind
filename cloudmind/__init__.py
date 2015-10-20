# -*- coding: utf-8 -*-
from flask import Flask, render_template, session
from flask_restful import Api
from flask.ext.sqlalchemy import SQLAlchemy
from cloudmind.config.default_config import DefaultConfig as Config
# from cloudmind.config.config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
api = Api(app)


@app.route('/')
def index():
    if 'user_idx' in session:
        return render_template('app.html')
    else:
        return render_template('intro.html')
