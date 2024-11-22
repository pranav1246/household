from flask import jsonify,request
from flask_restful import Resource
from flask_security import auth_required, roles_required,current_user
from applications.database.models import Service, ServiceRequest, db
from datetime import datetime
from applications.instance import cache

class CustomerDashboardAPI(Resource):
    @auth_required("token")
    @roles_required("Customer")
    @cache.cached(timeout=100,key_prefix=lambda: f"service_history_{current_user.id}") 
    def get(self):
        # Fetch all available services
        services = Service.query.all()
        service_data = [
            {
                "id": service.id,
                "name": service.name,
                "description": service.description,
                "base_price": service.base_price,
                "time_required": service.time_required
            }
            for service in services
        ]
        
        # Fetch current user's service history
        customer_id =current_user.id 
        service_history = ServiceRequest.query.filter_by(customer_id=customer_id).all()
        history_data = [
            {
                "id": request.id,
                "service_name": request.service.name,  
                "status": request.status,
                "date_of_request": request.date_of_request.strftime("%Y-%m-%d"),
                "remarks": request.remarks
            }
            for request in service_history
        ]

        return jsonify({
            "available_services": service_data,
            "service_history": history_data
        })
    
    @auth_required('token')
    @roles_required('Customer')  
    def put(self, request_id):
      
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404
        if service_request.status == 'closed':
            return {"message": "Service request is already closed"}, 400
        data = request.get_json()
        action = data.get("action")
        if action == "close":
            # Only assigned requests can be closed
            if service_request.status != 'assigned':
                return {"message": "Service request cannot be closed in its current state"}, 400
            # Update status to closed and set the date_of_completion
            service_request.status = 'closed'
            service_request.date_of_completion = datetime.now()
            db.session.commit()
            cache.delete(f"service_history_{current_user.id}")
        return {"message": f"Service request {action}ed successfully"}, 200
