from flask_restful import Resource
from flask_security import auth_required, roles_required
from applications.database.models import Service, ProfessionalDetails, ServiceRequest,User,db
from flask import jsonify 
from flask_restful import reqparse




class AdminDashboardResource(Resource):
    # @auth_required('token')
    # @roles_required("Admin")
    def get(self):
        # Fetch all services, professionals, and service requests
        services = Service.query.all()
        professionals = ProfessionalDetails.query.all()
        service_requests = ServiceRequest.query.all()

        # Serialize data for JSON response
        service_data = [
            {"id": service.id, "name": service.name, "base_price": service.base_price}
            for service in services
        ]
        
        professional_data = [
            {
                "id": pro.id,
                "name": pro.user.name,  # Accessing `name` from related User model
                "service_type": pro.service_type.name,  # Assuming `service_type` references Service model
                "experience_years": pro.experience_years,
                "rating": pro.rating,
                "is_active": pro.is_active,
                "attached_docs_path":pro.attached_docs_path,

            }
            for pro in professionals
        ]
        
        service_request_data = [
            {
                "id": request.id,
                "status": request.status,
                "customer_id": request.customer_id,
                "professional_id": request.professional_id,
                "date_of_request": request.date_of_request,
                "remarks": request.remarks
            }
            for request in service_requests
        ]

        return jsonify({
            "services": service_data,
            "professionals": professional_data,
            "service_requests": service_request_data
        })
    

    # @auth_required("token")
    # @roles_required("Admin")
    def put(self):
        
        parser = reqparse.RequestParser()
        parser.add_argument("user_id", type=int, required=True, help="User ID is required.")
        args = parser.parse_args()
        
        user_id = args["user_id"]

        # Query the User and ProfessionalDetails tables
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404

        # Check if the user has a ProfessionalDetails record to determine type
        professional_details = ProfessionalDetails.query.filter_by(user_id=user_id).first()

        if professional_details:
            # If user is a professional, toggle `is_active` in ProfessionalDetails
            professional_details.is_active = not professional_details.is_active
            db.session.commit()
            return {"message": f"Professional status toggled to {professional_details.is_active}"}, 200
        else:
            user.active = not user.active
            db.session.commit()
            return {"message": f"Customer status toggled to {user.active}"}, 200
        
   
  
    def delete(self, professional_id):
       
        professional = ProfessionalDetails.query.filter_by(id=professional_id).first()
        
        if not professional:
            return {"message": "Professional not found."}, 404
        user = User.query.filter_by(id=professional.user_id).first()
        
        if not user:
            return {"message": "Associated user not found."}, 404

        try:
    

            db.session.delete(professional)
            db.session.delete(user)
            db.session.commit()
            return {"message": "Professional and associated user details deleted successfully."}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred: {str(e)}"}, 500