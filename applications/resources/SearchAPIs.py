from flask import request ,jsonify
from flask_restful import Resource
from applications.database.models import Service, ProfessionalDetails, User, ServiceRequest

class AdminSearchAPI(Resource):
    # @auth_required("token")
    # @roles_required("Admin")
    def get(self):
        # Get query parameters
        service_name = request.args.get("service_name")
        professional_name = request.args.get("professional_name")
        customer_name = request.args.get("customer_name")
        
        # Filter services by name
        service_results = []
        if service_name:
            service_results = Service.query.filter(Service.name.ilike(f"%{service_name}%")).all()
        
        # Filter professionals by name
        professional_results = []
        if professional_name:
            professional_results = (
                ProfessionalDetails.query.join(User)
                .filter(User.name.ilike(f"%{professional_name}%"))
                .all()
            )
        
        # Filter customers by name in service requests
        customer_results = []
        if customer_name:
            customer_results = (
                ServiceRequest.query.join(User, ServiceRequest.customer_id == User.id)
                .filter(User.name.ilike(f"%{customer_name}%"))
                .all()
            )
        
        # Prepare the response data
        response_data = {
            "services": [{
                "id": service.id,
                "name": service.name,
                "description": service.description,
                "base_price": service.base_price
                
                } for service in service_results],
            "professionals": [
                {"id": prof.id, "name": prof.user.name, "service": prof.service_type.name} 
                for prof in professional_results
            ],
            "customers": [
                {"id": req.id, "customer_name": req.customer.name, "status": req.status} 
                for req in customer_results
            ]
        }
        
        return jsonify(response_data)
    

class CustomerSearchAPI(Resource):
    # @auth_required("token")
    # @roles_required("Customer")
    def get(self):
        # Get the service name query parameter
        service_name = request.args.get("service_name")
        
        # Filter services by name
        if service_name:
            services = Service.query.filter(Service.name.ilike(f"%{service_name}%")).all()
        else:
            services = Service.query.all()
        
        # Prepare the response data
        response_data = [
            {
                "id": service.id,
                "name": service.name,
                "description": service.description,
                "base_price": service.base_price
            }
            for service in services
        ]
        
        return jsonify({"available_services": response_data})
    

from datetime import datetime

class ProfessionalSearchAPI(Resource):
    # @auth_required("token")
    # @roles_required("Professional")
    def get(self):
        # Get query parameters
        request_date = request.args.get("date")
        address = request.args.get("address")
        pincode = request.args.get("pincode")
        
        query = ServiceRequest.query.join(User, ServiceRequest.customer_id == User.id)

        # Filter by date
        if request_date:
            try:
                parsed_date = datetime.strptime(request_date, "%Y-%m-%d")
                query = query.filter(ServiceRequest.date_of_request == parsed_date)
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Filter by address and pincode
        if address:
            query = query.filter(User.address.ilike(f"%{address}%"))
        if pincode:
            query = query.filter(User.pincode == pincode)
        
        results = query.all()
        
        # Prepare the response data
        response_data = [
            {
                "id": req.id,
                "service_name": req.service.name,
                "status": req.status,
                "customer_address": req.customer.address,
                "customer_pincode": req.customer.pincode,
                "date_of_request": req.date_of_request.strftime("%Y-%m-%d")
            }
            for req in results
        ]
        
        return jsonify({"service_requests": response_data})


