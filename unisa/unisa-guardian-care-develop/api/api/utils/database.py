import pyodbc
from functools import wraps

from api import environment as env

class mssql_connection(object):
    """Connection to an MSSQL database"""

    def __init__(self, connection_string=f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={env.DB_SERVER};DATABASE={env.DB_DATABASE};UID={env.DB_USERNAME};PWD={env.DB_PASSWORD}'):
        self.connection_string = connection_string
        self.connector = None

    def __enter__(self):
        self.connector =  pyodbc.connect(self.connection_string)
        return self

    def __exit__(self, exception_type, exception_val, exception_traceback):
        # Handle success case
        if exception_traceback is None:
            self.connector.commit()
        # Handle exception when using connection
        else:
            self.connector.rollback()

        # Clean up
        self.connector.close()

def db_connection(function):
    """Instantiate a db connection to use within the decorated function"""

    @wraps(function)
    def with_connection(*args, **kwargs):
        # Establish connection
        connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={env.DB_SERVER};DATABASE={env.DB_DATABASE};UID={env.DB_USERNAME};PWD={env.DB_PASSWORD}'
        connection =  pyodbc.connect(connection_string)

        try:
            # Add a reference to the DB connection to the function args
            connected_function = function(connection, *args, **kwargs)
        except Exception:
            # Handle exception when using connection
            connection.rollback()
            raise
        else:
            # Handle success case
            connection.commit()
        finally:
            # Clean up
            connection.close()

        return connected_function

    return with_connection
