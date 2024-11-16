from .models import db,User,Role
from flask_security import SQLAlchemyUserDatastore
datastore=SQLAlchemyUserDatastore(db,User,Role)