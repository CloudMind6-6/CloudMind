#  -*- coding: utf-8 -*-

import os.path
import tempfile

class Config(object):
    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(tempfile.gettempdir(), 'test.db')

    # Path
    UPLOAD_DIR = ''

    # OAuth
    OAUTH_GOOGLE_CLIENTID = ''
    OAUTH_GOOGLE_SECRETKEY = ''
