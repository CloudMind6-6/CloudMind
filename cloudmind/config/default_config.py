# -*- coding: utf-8 -*-
import os.path
import tempfile


class Config(object):
    # Server
    SERVER_NAME = 'yourdomain.com'

    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(tempfile.gettempdir(), 'test.db')

    # Path
    UPLOAD_DIR = os.path.abspath(os.path.dirname(__file__) + '/../..') + '/cloudmind/files'

    # OAuth
    OAUTH_GOOGLE_CLIENTID = ''
    OAUTH_GOOGLE_SECRETKEY = ''

    # EMAIL
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'you@google.com'
    MAIL_PASSWORD = 'GooglePasswordHere'
