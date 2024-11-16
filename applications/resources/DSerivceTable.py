from flask_restful import Resource
from flask_security import auth_required, roles_required
from flask import jsonify
from applications.database.models import Service  

class ServiceDetailsAPI(Resource):
    # @auth_required("token")
    # @roles_required(["Admin", "Customer"])
    def get(self):
        # Fetch all services from the database
        services = Service.query.all()

        # Serialize the data
        service_data = [
            {
                "id": service.id,
                "name": service.name,
                "description": service.description,  
                "base_price": service.base_price,
                 "duration": service.time_required  
                
            }
            for service in services
        ]

        # Return data as JSON
        return jsonify({"services": service_data})
