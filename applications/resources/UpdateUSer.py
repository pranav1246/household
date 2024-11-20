from flask_restful import Resource, reqparse
from flask_security import auth_required, roles_required
from flask import jsonify
from applications.database.models import db, User,ProfessionalDetails

class UpdateCustomerDetailsAPI(Resource):
    @auth_required("token")
    @roles_required("Customer")
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

        try:
             db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"message": f"Failed to update professional details: {str(e)}"}, 500
        return {"message": "Customer details updated successfully."}, 200





class UpdateProfessionalDetailsAPI(Resource):
    @auth_required("token")
    @roles_required("Service Professional")
    def put(self, professional_id):
        parser = reqparse.RequestParser()
        parser.add_argument('experience_years', type=int, required=False)
        parser.add_argument('email', type=str, required=False)
        parser.add_argument('phone_number', type=str, required=False)
        parser.add_argument('address', type=str, required=False)
        parser.add_argument('pincode', type=str, required=False)
        args = parser.parse_args()

        professional = ProfessionalDetails.query.filter_by(id=professional_id).first()
        
        if not professional:
            return {"message": "Professional not found."}, 404
        print(professional)
        
        if args['experience_years'] is not None:
            professional.experience_years = args['experience_years']
        if args['email'] is not None:
            professional.email = args['email']
        if args['phone_number'] is not None:
            professional.phone_number = args['phone_number']
        if args['address'] is not None:
            professional.address = args['address']
        if args['pincode'] is not None:
            professional.pincode = args['pincode']
     

        try:
             db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"message": f"Failed to update professional details: {str(e)}"}, 500

        return {"message": "Professional details updated successfully."}, 200
