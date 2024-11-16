from flask_restful import Resource
from flask_security import auth_required, roles_required, current_user
from datetime import datetime
from applications.database.models import db, ServiceRequest
from applications.utils import service_request_parser,update_service_req_parser

class ServiceRequestResource(Resource):
    @auth_required("token")
    @roles_required("Customer")
    def post(self):
        parser = service_request_parser()
        args = parser.parse_args()
        
        service_id = args['service_id']
        remarks = args.get('remarks', "")

        # Create a new service request instance
        new_request = ServiceRequest(
            service_id=service_id,
            customer_id=current_user.id,  
            remarks=remarks,
            date_of_request=datetime.now(),  # Automatically sets today's date
        )

        # Add to session and commit
        db.session.add(new_request)
        db.session.commit()

        return {"message": "Service request created successfully.", "request_id": new_request.id}, 201
    

    @auth_required("token")
    @roles_required("Customer")
    def put(self, request_id):
        
        parser=update_service_req_parser()
        args = parser.parse_args()
        
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found."}, 404

        if service_request.customer_id != current_user.id:
            return {"message": "Unauthorized to edit this service request."}, 403

        
        service_request.date_of_request = datetime.now()

    
        if args['status']:
            service_request.status = args['status']
        if args['remarks']:
            service_request.remarks = args['remarks']

      
        db.session.commit()

        return {"message": "Service request updated successfully."}, 200