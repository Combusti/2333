import sys
from os import environ as env
from dotenv import find_dotenv, load_dotenv

# Find and load the .env configuration file
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)
else:
    sys.exit(".env file not found. Exiting.")

# Auth settings
AUTH_DOMAIN = env.get("AUTH_DOMAIN")
AUTH_OIDC_CONFIGURATION_URL = env.get("AUTH_OIDC_CONFIGURATION_URL")
AUTH_SUPPORTED_ALGS = env.get("AUTH_SUPPORTED_ALGS")
AUTH_ISSUER = env.get("AUTH_ISSUER")
AUTH_AUDIENCE = env.get("AUTH_AUDIENCE")

# Database settings
DB_SERVER = env.get("DB_SERVER")
DB_DATABASE = env.get("DB_DATABASE")
DB_USERNAME = env.get("DB_USERNAME")
DB_PASSWORD = env.get("DB_PASSWORD")

# Debug settings
DEBUG_FORCE_AUTH_ERROR = env.get("DEBUG_FORCE_AUTH_ERROR")

# Feature flags
FEATURE_SOLUTION_MODE = env.get("FEATURE_SOLUTION_MODE")