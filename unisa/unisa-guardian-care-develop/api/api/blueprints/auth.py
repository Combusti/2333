import uuid
from flask import Blueprint, jsonify, make_response, request

from api.models.error import AuthError
from api.utils.auth import requires_auth
from api.utils.database import db_connection

auth = Blueprint(name='auth', import_name=__name__)

@auth.route('/unauthenticated')
def get_unauthenticated():
    return jsonify(dict({"authenticated": False})) 

@auth.route('/authenticated')
@requires_auth
def get_authenticated():
    return jsonify(dict({"authenticated": True})) 

@auth.route('/user/list')
@db_connection
def get_user_list(connection):
    """Get the list of all users. For debugging purposes only"""

    # Use legacy authentication
    # TODO: Validate the cookie?
    cookie = request.cookies.get('session')
    if (not cookie):
        raise AuthError({"code": "not_logged_in", "description": "You must log in to access this resource"}, 401)

    # Get DB cursor
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM [User]")
    columns = [column[0] for column in cursor.description]

    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    # Log the user in
    response = make_response(jsonify(results), 200)
    response.headers.add('Access-Control-Allow-Credentials', 'true')

    return response

@auth.route('/register', methods=["POST"])
@db_connection
def register(connection):
    # Get data from form
    # TODO validate inputs
    username = request.form.get('username')
    password = request.form.get('password')

    # Get DB cursor
    cursor = connection.cursor()

    # Validate that the user does not exist
    cursor.execute(f"SELECT * FROM [User] WHERE username = '{username}'")
    rows = cursor.fetchall()
    if (len(rows) > 0):
        raise AuthError({"code": "user_exists", "description": "This user already exists."}, 422)

    # Create the user
    sql = f"""
    INSERT INTO [User] (username, password)
    VALUES ('{username}', '{password}')
    """
    cursor.execute(sql)

    return {}

@auth.route('/login', methods=["POST"])
@db_connection
def login(connection):
    # Get data from form
    # TODO validate inputs
    username = request.form.get('username')
    password = request.form.get('password')

    # Get DB cursor
    cursor = connection.cursor()

    # Get the user record with a matching username and password
    cursor.execute(f"SELECT * FROM [User] WHERE username = '{username}' AND password = '{password}'")
    columns = [column[0] for column in cursor.description]
    user = cursor.fetchone()

    # Handle user with matching credentials not found
    if(not user):
        raise AuthError({"code": "credentials_invalid", "description": "Invalid username or password"}, 422)

    # Make a dict so the user is easier to work with
    user_dict = dict(zip(columns, user))

    # Log the user in
    response = make_response({'success': True, 'username': user_dict["username"]}, 200)
    # TODO: Store session token somewhere...
    response.set_cookie('session', str(uuid.uuid4()))
    response.headers.add('Access-Control-Allow-Credentials', 'true')

    return response

@auth.route('/logout', methods=["POST"])
@db_connection
def logout(connection):
    # Log the user out
    response = make_response({'success': True}, 200)
    # TODO: Invalidate session?..
    response.delete_cookie('session')

    return response