from datetime import datetime

from marshmallow import Schema, fields

class Product():
    def __init__(self, name, amount, is_contact_sales):
        self.name = name
        self.amount = amount
        self.is_contact_sales = is_contact_sales

        # Metadata
        self.created_at = datetime.now()
    
class ProductSchema(Schema):
    name = fields.Str()
    amount = fields.Number()
    is_contact_sales = fields.Boolean()
    
    created_at = fields.Date()

products_mock = [
    Product('Free', 0, False ),
    Product('Pro', 2900, False ),
    Product('Business', 4900, False ),
    Product('Enterprise', 0, True ),
]