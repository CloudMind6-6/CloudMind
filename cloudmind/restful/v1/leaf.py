from cloudmind.blueprint import apiv1
from cloudmind import db
from cloudmind.model.leaf import Leaf
from cloudmind.model.node import Node
from cloudmind.model.user import User
from flask import current_app
from flask import request
from flask import send_file
from flask import session
from flask_restful import abort
from flask_restful import Resource
import json
import os
import time
import uuid
from werkzeug import secure_filename


@apiv1.route('/leaf/<int:leaf_id>')
def leaf_download(leaf_id):
    if 'user_id' not in session:
        return "already logged out"

    leaf = db.session.query(Leaf).filter(Leaf.id == leaf_id).first()
    if leaf is None:
        return "Not found {}".format("Leaf")

    root_node = leaf.root_node
    if root_node is None:
        return "Not found {}".format("Node")
    if root_node.check_member(session['user_id']) is False:
        return "노드멤버 아님"

    return send_file(leaf.file_path, as_attachment=True, attachment_filename=leaf.name, mimetype=leaf.file_type)


class LeafUpload(Resource):
    def post(self):
        userfile = request.files['userfile']
        parent_node_id = request.args.get('node_parent_idx')
        if 'user_id' not in session:
            abort(403, message="already logged out")

        parent_node = db.session.query(Node).filter(Node.id == parent_node_id).first()
        if parent_node is None:
            abort(404, message="Not found {}".format("Node"))
        if parent_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        name = secure_filename(userfile.filename)
        filename = secure_filename(str(int(time.time() * 1000))+'_'+uuid.uuid4().hex)
        filepath = os.path.join(current_app.config['UPLOAD_DIR'], filename)
        userfile.save(filepath)

        creator = User.query.filter(User.userid == session['user_id']).first()
        leaf = Leaf(name=name, file_path=filepath)
        leaf.creator = creator
        leaf.parent_node = parent_node
        db.session.add(leaf)
        db.session.commit()
        return {"success": True}


class LeafRemove(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        leaf_id = args['leaf_idx']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        leaf = db.session.query(Leaf).filter(Leaf.id == leaf_id).first()
        if leaf is None:
            abort(404, message="Not found {}".format("Node"))

        root_node = leaf.root_node
        if root_node is None:
            abort(404, message="Not found {}".format("root_node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        leaf.remove_all()

        nodes = db.session.query(Node).filter(Node.root_node_id == root_node.id).all()
        return {
            'success': True,
            'node_list': [i.serialize for i in nodes]
            }
