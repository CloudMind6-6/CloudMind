from cloudmind import mail
from flask.ext.mail import Message


def mail_send_invite(from_user, to_user, root_node):
    msg = Message(
        'Hello',
        sender='cloudmindswmaestro@gmail.com',
        recipients=[to_user.email])
    msg.html = "<b>test</b>"
    mail.send(msg)
