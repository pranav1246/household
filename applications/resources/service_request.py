from flask_restful import Resource
from flask_security import auth_required, roles_required, current_user
from datetime import datetime
from applications.database.models import db, ServiceRequest
from applications.utils import service_request_parser,update_service_req_parser
# from applications.instance import cache

class ServiceRequestResource(Resource):
    @auth_required('token')
    @roles_required('Customer')
    def post(self):
        parser = service_request_parser()
        args = parser.parse_args()
        
        service_id = args['service_id']
        remarks = args.get('remarks', "")

     
        new_request = ServiceRequest(
            service_id=service_id,
            customer_id=current_user.id,  
            remarks=remarks,
            date_of_request=datetime.now(),  
        )

  
        db.session.add(new_request)
        db.session.commit()
        # cache.delete(f"service_history_{current_user.id}")

        return {"message": "Service request created successfully.", "request_id": new_request.id}, 201
    

    @auth_required('token')
    @roles_required('Customer')
    def put(self, request_id):
      
        parser=update_service_req_parser()
        args = parser.parse_args()

   
        service_request = ServiceRequest.query.filter_by(id=request_id, customer_id=current_user.id).first()
        if not service_request:
            return {"message": "Service request not found or not authorized to edit."}, 404

   
        if args['service_type']:
            service_request.service_type = args['service_type']
        if args['description']:
            service_request.description = args['description']
        if args['address']:
            service_request.address = args['address']
        if args['pincode']:
            service_request.pincode = args['pincode']

 
        db.session.commit()
        # cache.delete(f"service_history_{current_user.id}")
        return {"message": "Service request updated successfully."}, 200

    @auth_required('token')
    @roles_required('Customer')
    def delete(self, request_id):
      
        service_request = ServiceRequest.query.filter_by(id=request_id, customer_id=current_user.id).first()
        if not service_request:
            return {"message": "Service request not found or not authorized to delete."}, 404

      
        db.session.delete(service_request)
        db.session.commit()
        # cache.delete(f"service_history_{current_user.id}")
        return {"message": "Service request deleted successfully."}, 200