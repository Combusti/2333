import distutils
import json
from flask import request, _request_ctx_stack
from functools import wraps
from jose import jwt
from six.moves.urllib.request import urlopen

from api import environment as env
from api.models.error import AuthError

def requires_auth(function):
    """Validates an Access Token"""

    @wraps(function)
    def decorated(*args, **kwargs):
        # DEBUG HELPER
        # Raise an AuthError if DEBUG_FORCE_AUTH_ERROR=True
        if bool(distutils.util.strtobool(env.DEBUG_FORCE_AUTH_ERROR)):
            raise AuthError({"code": "invalid_jwt_debug", "description": "Authentication token was rejected due to env setting DEBUG_FORCE_AUTH_ERROR being enabled."}, 401)

        # Retrieve the access token from the Authorization header
        # Performs basic validation on the structure of the header
        # Throws if validation fails
        token = _get_token_from_auth_header()

        # Parse the header from the JWT
        # Note: jwt.get_unverified_header does not perform any validation
        try:
            unverified_header = jwt.get_unverified_header(token)
        # Handle header is in an invalid format
        except jwt.JWTError as jwt_error:
            raise AuthError({"code": "invalid_jwt_header", "description": "Unable to decode JWT header. JWT may be malformed."}, 401) from jwt_error
        
        # WK6 TODO: Validate that the token is using the RS256 signature algorithm
        # The header should look something like this:
        #   {
        #       "alg": "RS256",
        #       "typ": "JWT",
        #       "kid": "LTeBHPivUicwdA_cYi4rIhXnjri2MAekxhMFvISvvvY"
        #   }
        #
        # Validate that the alg is RS256 using an allow-list approach (as opposed to a deny-list approach)
        # If the algorithm does not match, throw AuthError
        # 
        # Note: we choose RS256 over HS265 since RS256 is asymmetric and HS256 is symmetric
        # You can read more here: https://auth0.com/blog/rs256-vs-hs256-whats-the-difference/

        # Code here...

        # Load the OIDC configuration from the IdP (Keycloak)
        oidc_configuration_url = urlopen(env.AUTH_OIDC_CONFIGURATION_URL)
        oidc_configuration = json.loads(oidc_configuration_url.read())

        # Load the public keys used to sign the token from the IdP (Keycloak)
        jwks_url = urlopen(oidc_configuration.get('jwks_uri'))
        jwks = json.loads(jwks_url.read())
        keys = jwks["keys"]
        
        # Our identity provider may have multiple signing keys.
        # WK6 TODO PART 1: Find the the RSA key that was used to sign this token
        # i.e. find the index of the key in the the keys variable where the kid matches the kid in unverified_header
        # If no key matches, throw AuthError

        # Code here...

        # WK6 TODO: Store the index of the matching key in the following variable:
        signing_key_index = 0

        # Decode and validate the token
        # jwt.decode throws exceptions when token validation fails
        try:
            payload = jwt.decode(
                token=token,
                key=jwks["keys"][signing_key_index],
                algorithms=env.AUTH_SUPPORTED_ALGS,
                audience=env.AUTH_AUDIENCE,
                issuer=env.AUTH_ISSUER
            )

        # Handle expired token (when the exp claim is before current timestamp)
        except jwt.ExpiredSignatureError as expired_signature_error:
            raise AuthError({"code": "invalid_jwt_expired", "description": "Authentication token has expired."}, 401) from expired_signature_error
        # Handle invalid claims (checks aud, iat, exp, nbf, iss, sub, jti clams)
        except jwt.JWTClaimsError as invalid_claims_error:
            raise AuthError({"code": "invalid_jwt_claims", "description": f'Authentication token invalid claims: {invalid_claims_error}'}, 401) from invalid_claims_error
        # Handle invalid signature (signature does not match, issues fetcing or validating keys)
        except jwt.JWTError as invalid_signature_error:
            raise AuthError({"code": "invalid_jwt_signature", "description": "Authentication token has an invalid signature."}, 401) from invalid_signature_error
        # Generic handler for all other raised errors
        except Exception as exception:
            raise AuthError({"code": "invalid_jwt", "description": "Unable to parse authentication token."}, 401) from exception

        # Add the validated token to the request context for later retrieval
        _request_ctx_stack.top.current_user = payload

        # Return the function that was decorated with @requires_auth
        return function(*args, **kwargs)

    # Return the decorated version of the input
    return decorated

def requires_role(role):
    """Validates user has provided role"""

    def decorated(function):

        @wraps(function)
        def wrapper(*args, **kwargs):
            # Retrieve the user's token from the request context
            token_payload = _request_ctx_stack.top.current_user
            
            # WK6 TODO: Handle no token (this should never happen, it's a sanity check)
            # If validation fails, throw AuthError

            # WK6 TODO: Fetch the user's roles from the token

            # WK6 TODO: Validate the user is in the specified role
            # If validation fails, throw AuthError

            return function(*args, **kwargs)

        # Return the function that was decorated with @requires_role
        return wrapper

    # Return the decorated version of the input
    return decorated

def _get_token_from_auth_header():
    """Retrieves the access token from the Authorization Header"""

    # Get the Authorization header
    header = request.headers.get("Authorization", None)

    # For a valid header:
    # header = "Bearer eyJ.....""

    # Validate the header exists
    if not header:
        raise AuthError({"code": "authorization_header_missing", "description": "Authorization header is expected"}, 401)

    # Split the header on whitespace
    header_parts = header.split()

    # In a valid token:
    # header_parts[0] = Bearer
    # header_parts[1] = eyJ.....

    # Handle Authorization header not starting with Bearer
    if header_parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header", "description": "Authorization header must start with Bearer"}, 401)

    # Handle authorisation header not having a second part (the token itself)
    if len(header_parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)

    # Handle authorisation header having more than three parts
    if len(header_parts) > 2:
        raise AuthError({"code": "invalid_header", "description": "Authorization header must be 'Bearer eyJ...'"}, 401)

    # Header is valid, return the token part
    return header_parts[1]