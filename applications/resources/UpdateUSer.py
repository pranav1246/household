from flask_restful import Resource, reqparse
from flask_security import auth_required, roles_required
from flask import jsonify
from applications.database.models import db, User,ProfessionalDetails

class UpdateCustomerDetailsAPI(Resource):
    # @auth_required("token")
    # @roles_required("Customer")
    def put(self, customer_id):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=False)
        parser.add_argument('phone_number', type=str, required=False)
        parser.add_argument('address', type=str, required=False)
        parser.add_argument('pincode', type=str, required=False)
        args = parser.parse_args()

        customer = User.query.filter_by(id=customer_id).first()
        
        if not customer:
            return {"message": "Customer not found."}, 404

       
        if args['email']:
            customer.email = args['email']
        if args['phone_number']:
            customer.phone_number = args['phone_number']
        if args['address']:
            customer.address = args['address']
        if args['pincode']:
            customer.pincode = args['pincode']

        db.session.commit()
        return {"message": "Customer details updated successfully."}, 200





class UpdateProfessionalDetailsAPI(Resource):
    # @auth_required("token")
    # @roles_required("Professional")
    def put(self, professional_id):
        parser = reqparse.RequestParser()
        parser.add_argument('experience_years', type=int, required=False)
        parser.add_argument('is_active', type=bool, required=False)
        parser.add_argument('attached_docs_path', type=str, required=False)
        args = parser.parse_args()

        professional = ProfessionalDetails.query.filter_by(id=professional_id).first()
        
        if not professional:
            return {"message": "Professional not found."}, 404

        # Update fields based on provided data
        if args['experience_years'] is not None:
            professional.experience_years = args['experience_years']
        if args['is_active'] is not None:
            professional.is_active = args['is_active']
        if args['attached_docs_path']:
            professional.attached_docs_path = args['attached_docs_path']

        db.session.commit()
        return {"message": "Professional details updated successfully."}, 200
