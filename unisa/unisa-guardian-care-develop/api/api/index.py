import distutils
from flask import Flask
from flask_cors import CORS

from api import environment as env
from api.blueprints.admin import admin
from api.blueprints.heartbeat import heartbeat
from api.blueprints.product import product
from api.models.error import AuthError
from api.utils.error import handle_auth_error

# Dynamically load exercise / solution modules
if bool(distutils.util.strtobool(env.FEATURE_SOLUTION_MODE)):
    # Load auth blueprint
    try:
        from api.blueprints.admin_solution import admin
    except ImportError:
        from api.blueprints.admin import admin
    # Load auth blueprint
    try:
        from api.blueprints.auth_solution import auth
    except ImportError:
        from api.blueprints.auth import auth
    # Load product blueprint
    try:
        from api.blueprints.product_solution import product
    except ImportError:
        from api.blueprints.product import product
else:
    from api.blueprints.admin import admin
    from api.blueprints.auth import auth
    from api.blueprints.product import product

# Set up Flask app
app = Flask(__name__)

# Configure CORS
# This config allows all ows all headers from all origins, and is not safe for production
# TODO: Lock down with a secure CORS config
CORS(app)

# Register error handlers
app.register_error_handler(AuthError, handle_auth_error)

# Register blueprints
app.register_blueprint(admin, url_prefix="/admin")
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(heartbeat, url_prefix="/heartbeat")
app.register_blueprint(product, url_prefix="/product")
