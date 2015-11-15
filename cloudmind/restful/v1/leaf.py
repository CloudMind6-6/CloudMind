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
from urllib.parse import quote
import uuid
from werkzeug import secure_filename


@apiv1.route('/leaf/<int:leaf_id>')
def leaf_download(leaf_id):
    is_thumbnail = request.args.get('t', None)

    if 'user_id' not in session:
        return "already logged out"

    leaf = db.session.query(Leaf).filter(Leaf.id == leaf_id).first()
    if leaf is None:
        return "Not found {}".format("Leaf")

    parent_node = leaf.parent_node
    if parent_node is None:
        return "Not found {}".format("Node")
    if parent_node.check_member(session['user_id']) is False:
        return "노드멤버 아님"

    if is_thumbnail == 'true' and leaf.file_type[:5] == 'image':
        return send_file(
            leaf.file_path + ".thumbnail",
            as_attachment=True,
            attachment_filename='thumbnail.jpg',
            mimetype='image/jpeg'
        )
    return send_file(
        leaf.file_path,
        as_attachment=True,
        attachment_filename=quote(leaf.name),
        mimetype=leaf.file_type
    )


class LeafList(Resource):
    def get(self):
        root_id = request.args.get('root_idx')

        if 'user_id' not in session:
            abort(403, message="already logged out")

        root_node = db.session.query(Node).filter(Node.id == root_id).first()
        if root_node is None:
            abort(404, message="Not found {}".format("Node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        leafs = db.session.query(Leaf).filter(Leaf.root_node_id == root_id).all()
        return {
            'success': True,
            'leaf_list': [i.serialize for i in leafs]
            }


class LeafUpload(Resource):
    def post(self):
        userfile = request.files['userfile']
        parent_node_id = request.form.get('node_parent_idx')
        if 'user_id' not in session:
            abort(403, message="already logged out")

        parent_node = db.session.query(Node).filter(Node.id == parent_node_id).first()
        if parent_node is None:
            abort(404, message="Not found {}".format("Node"))
        if parent_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        name = userfile.filename
        filename = secure_filename(str(int(time.time() * 1000))+'_'+uuid.uuid4().hex)
        filepath = os.path.join(current_app.config['UPLOAD_DIR'], filename)
        userfile.save(filepath)

        creator = User.query.filter(User.id == session['user_id']).first()
        leaf = Leaf(name=name, file_path=filepath)
        leaf.creator = creator
        leaf.parent_node = parent_node
        leaf.root_node = parent_node.root_node
        db.session.add(leaf)
        db.session.commit()

        nodes = db.session.query(Node).filter(Node.root_node_id == parent_node.root_node_id).all()
        return {
            "success": True,
            "leaf": leaf.serialize,
            'node_list': [i.serialize for i in nodes]
        }


class LeafRemove(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        leaf_id = args['leaf_idx']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        leaf = db.session.query(Leaf).filter(Leaf.id == leaf_id).first()
        if leaf is None:
            abort(404, message="Not found {}".format("Leaf"))

        root_node = leaf.root_node
        if root_node is None:
            abort(404, message="Not found {}".format("root_node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        db.session.delete(leaf)
        db.session.commit()

        nodes = db.session.query(Node).filter(Node.root_node_id == root_node.id).all()
        return {
            'success': True,
            'node_list': [i.serialize for i in nodes]
            }


class LeafUpdate(Resource):
    def post(self):
        args = json.loads(request.data.decode('utf-8'))
        leaf_id = args['leaf_idx']
        node_parent_id = args['parent_node_idx']

        if 'user_id' not in session:
            abort(403, message="already logged out")

        leaf = db.session.query(Leaf).filter(Leaf.id == leaf_id).first()
        if leaf is None:
            abort(404, message="Not found {}".format("Leaf"))

        root_node = leaf.root_node
        if root_node is None:
            abort(404, message="Not found {}".format("root_node"))
        if root_node.check_member(session['user_id']) is False:
            abort(404, message="노드멤버 아님")

        leaf.parent_node_id = node_parent_id
        db.session.commit()

        return {
            'success': True
            }
