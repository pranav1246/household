from app import app
from applications.database.models import db, User, Role, Service, ServiceRequest
from applications.database.sec import datastore
from flask_security.utils import hash_password

with app.app_context():
    # Seed Roles
    for role_name in ['Admin', 'Service Professional', 'Customer']:
        if not Role.query.filter_by(name=role_name).first():
            datastore.create_role(name=role_name)
    
    # Commit roles
    db.session.commit()

    # Seed Users
    users = [ #admin super-user 
        {
            'email': 'admin@gmail.com',
            'password': '1234',
            'name': 'Super User',
            'phone_number': '100000000',
            'roles': ['Admin']

        },
        {
            'email': 'customer@example.com',
            'password': '1234',
            'name': 'Customer User',
            'phone_number': '5678901234',
            'roles': ['Customer']
        }
    ]

    for user_data in users:
        if not User.query.filter_by(email=user_data['email']).first():
            roles = [Role.query.filter_by(name=role).first() for role in user_data['roles']]
            datastore.create_user(
                email=user_data['email'],
                password=hash_password(user_data['password']),
                name=user_data['name'],
                phone_number=user_data['phone_number'],
                roles=roles
            )
    
    db.session.commit()

    # Seed Services
    services = [
        {"name": "Plumbing", "description": "Fixing leaks and pipes","base_price":100,"time_required":10,"created_by":1},
        {"name": "Cleaning", "description": "Household cleaning services","base_price":100,"time_required":10,"created_by":1},
        {"name": "Electrical", "description": "Electrical maintenance","base_price":100,"time_required":10,"created_by":1}
    ]

    for service_data in services:
        if not Service.query.filter_by(name=service_data["name"]).first():
            new_service = Service(**service_data)
            db.session.add(new_service)
    
    db.session.commit()

    print("Database seeded successfully!")
