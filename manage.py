#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask.ext.script import Command, Manager
from flask.ext.migrate import Migrate, MigrateCommand
from cloudmind import app, db

migrate = Migrate(app, db)
manager = Manager(app)


class DebugCommand(Command):
    def run(self):
        app.run(host='0.0.0.0', port=8080, debug=True)


class RunCommand(Command):
    def run(self):
        app.run(host='0.0.0.0', port=8080, debug=False)

manager.add_command('debug', DebugCommand)
manager.add_command('run', RunCommand)
manager.add_command('db', MigrateCommand)
manager.run()
