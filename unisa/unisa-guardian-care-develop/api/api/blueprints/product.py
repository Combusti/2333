from flask import Blueprint, jsonify

from api.utils.database import db_connection

product = Blueprint(name='product', import_name=__name__)

# Returns the list of products available for purchase
@product.route('/list')
@db_connection
def get_products(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM [Product] WHERE isActive = 1") 

    columns = [column[0] for column in cursor.description]
    results = []

    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    return jsonify(results)