from cloudmind import mail
from flask.ext.mail import Message
from flask import url_for


def mail_send_invite(participant):
    from_user = participant.from_user
    to_user = participant.user
    msg = Message(
        'Hello',
        sender='cloudmindswmaestro@gmail.com',
        recipients=[to_user.email])
    msg.html = \
        """
        {from_user.name}({from_user.email})님이 {to_user.name}({to_user.email})님을 '{project_name}'에 초대하였습니다.<br/>
        <a href="{invite_url}" >수락하기</a>
        """.format(
            from_user=from_user,
            to_user=to_user,
            project_name=participant.own_node.name,
            invite_url=url_for('invite_ok', _external=True, participant_id=participant.id)
        )
    mail.send(msg)
