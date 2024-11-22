from applications.utils import service_resource_parser
from flask_restful import Resource
from flask_security import auth_required, roles_required
from applications.database.models import db, Service
from flask import jsonify

class ServiceResource(Resource):
    
    def get(self, service_id=None):
        if service_id:
            service = Service.query.get(service_id)
            if not service:
                return jsonify({"error": "Service not found"}), 404

            return jsonify({
                "id": service.id,
                "name": service.name,
                "description": service.description,
                "base_price": service.base_price,
                "time_required": service.time_required
            })
        
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
        return jsonify({"services": service_data})

    @auth_required("token")
    @roles_required("Admin")
    def post(self):
        parser=service_resource_parser()
        args = parser.parse_args()
        name = args['name']
        description = args.get('description', "")
        base_price = args['base_price']
        time_required = args['time_required']


       
        new_service = Service(
            name=name,
            description=description,
            base_price=base_price,
            time_required=time_required,
            created_by=1  
        )

     
        db.session.add(new_service)
        db.session.commit()

        return {"message": "Service created successfully.", "service_id": new_service.id}, 201
    
    @auth_required("token")
    @roles_required("Admin")
    def put(self, service_id):
        parser = service_resource_parser()
        args = parser.parse_args()

  
        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found."}, 404

        service.name = args['name'] if args['name'] else service.name
        service.description = args.get('description', service.description)
        service.base_price = args['base_price'] if args['base_price'] else service.base_price
        service.time_required = args['time_required'] if args['time_required'] else service.time_required

        db.session.commit()

        return {"message": "Service updated successfully.", "service_id": service.id}, 200

    @auth_required("token")
    @roles_required("Admin")
    def delete(self, service_id):
        # Retrieve the service by ID
        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found."}, 404

        # Delete the service
        db.session.delete(service)
        db.session.commit()

        return {"message": "Service deleted successfully."}, 200
    
    
