from flask import Blueprint, jsonify

from api import environment as env
from api.utils.auth import requires_auth, requires_role
from api.utils.database import db_connection

admin = Blueprint(name='admin', import_name=__name__)

@admin.route('/environment')
def get_environment():
    return jsonify(dict(env.env))

@admin.route('/user/list')
@db_connection
def get_user_list(connection):
    """Get the list of all users. For debugging purposes only"""
    # Get DB cursor
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM [User]")
    columns = [column[0] for column in cursor.description]

    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    return jsonify(results)