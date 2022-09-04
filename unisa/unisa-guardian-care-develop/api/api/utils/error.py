from flask import jsonify, Response

def handle_auth_error(exception) -> Response:
    response = jsonify(exception.error)
    response.status_code = exception.status_code
    return response