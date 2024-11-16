from flask import request, current_app
from flask_restful import Resource
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os
from applications.database.models import db, User, Role,Service,ProfessionalDetails
from applications.database.sec import datastore
from applications.utils import customer_signup_parser, professional_signup_parser
import uuid

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class CustomerSignup(Resource):
    def post(self):
        parser = customer_signup_parser()
        data = parser.parse_args()
        phone_number=data['phone_number']
        email = data['email']
        password = data['password']
        name = data['name']
        address = data['address']
        pincode = data['pincode']

        # Check if the user already exists
        if User.query.filter_by(email=email).first():
            return {"message": "User already exists"}, 400

        # Ensure "Customer" role exists
        customer_role = Role.query.filter_by(name="Customer").first()
        if not customer_role:
            customer_role = Role(name="Customer")
            db.session.add(customer_role)
            db.session.commit()

        # Create customer user
        user = datastore.create_user(
            email=email,
            password=generate_password_hash(password),
            phone_number=phone_number,
            name=name,
            address=address,
            pincode=pincode,
            roles=[customer_role]
        )
        db.session.commit()
        
        return {"message": "Customer registered successfully"}, 201



class ProfessionalSignup(Resource):
    def post(self):
        parser = professional_signup_parser()
        data = parser.parse_args()
        
        email = data['email']
        password = data['password']
        name = data['name']
        phone_number = data['phone_number']
        experience_years = data['experience_years']
        address = data['address']
        pincode = data['pincode']
        service_name = data['service_name']
        attached_docs=data['attached_docs']  

     
       
        professional_role = Role.query.filter_by(name="Service Professional").first()
        if not professional_role:
            professional_role = Role(name="Service Professional")
            db.session.add(professional_role)
            db.session.commit()

        # Create the User record
        new_user = datastore.create_user(
            email=email,
            password=generate_password_hash(password),
            name=name,
            phone_number=phone_number,
            address=address,
            pincode=pincode,
            roles=[professional_role]
        )
        db.session.add(new_user)
        db.session.commit()

        # Find or create the relevant service
        service = Service.query.filter_by(name=service_name).first()
        if not service:
            return {"message": "Service not found."}, 400

        # Create the ProfessionalDetails record linked to the new User
        new_professional_details = ProfessionalDetails(
            user_id=new_user.id,
            experience_years=int(experience_years),
            service_type_id=service.id,
            rating=0.0,
            is_active=True,
            attached_docs_path=attached_docs
        )
        db.session.add(new_professional_details)
        db.session.commit()

        return {"message": "Professional registered successfully"}, 201






