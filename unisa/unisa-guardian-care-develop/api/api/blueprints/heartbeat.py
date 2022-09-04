from datetime import datetime
from flask import Blueprint, jsonify

heartbeat = Blueprint(name='heartbeat', import_name=__name__)

@heartbeat.route("/")
def get_heartbeat():
    """Returns the current time. Helpful to validate the API is running"""
    return datetime.now().strftime('%c')