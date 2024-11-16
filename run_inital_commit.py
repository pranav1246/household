from app import app

from applications.database.sec import datastore
from applications.database.models import db,Role,User

from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    for role_name in ['Admin', 'Service Professional', 'Customer']:
        if not Role.query.filter_by(name=role_name).first():
            datastore.create_role(name=role_name)
    db.session.commit()

    if not User.query.filter_by(email='admin@example.com').first():
        admin_role = Role.query.filter_by(name='Admin').first()
        datastore.create_user(
            email='admin@example.com',
            password=generate_password_hash('1234'),  
            name='Admin User',
            phone_number='1234567890',
            roles=[admin_role]
        )
        db.session.commit()