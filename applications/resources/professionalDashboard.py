from flask import jsonify,request
from flask_restful import Resource
from flask_security import auth_required, roles_required,current_user
from applications.database.models import db, ServiceRequest, User,Review,ProfessionalDetails
from datetime import datetime

class ProfessionalRequestsAPI(Resource):
    @auth_required('token')  
    @roles_required('Service Professional')  
    def get(self):
        # Get the current professional's ID and specialization
        professional_id = current_user.id
        professional = ProfessionalDetails.query.get(professional_id)
        
        if not professional:
            return {"message": "Professional not found"}, 404
        
        specialization = professional.service_type_id 
        
        # Query pending service requests for the professional's specialization
        pending_requests = (
            db.session.query(
                ServiceRequest.id.label("request_id"),
                User.name.label("customer_name"),
                User.phone_number,
                User.address,
                User.pincode,
                ServiceRequest.remarks,
                ServiceRequest.date_of_request,
                ServiceRequest.status
            )
            .join(User, ServiceRequest.customer_id == User.id)
            .filter(
                ServiceRequest.service_id  == specialization,  
                ServiceRequest.status.in_(['requested', 'rejected'])
            )
            .all()
        )
        
        # Query closed service requests with associated ratings and reviews
        closed_requests = (
            db.session.query(
                ServiceRequest.id.label("request_id"),
                User.name.label("customer_name"),
                User.phone_number,
                User.address,
                User.pincode,
                ServiceRequest.remarks,
                ServiceRequest.date_of_request,
                ServiceRequest.status,
                Review.rating,
                Review.comments.label("review")
            )
            .join(User, ServiceRequest.customer_id == User.id)
            .outerjoin(Review, ServiceRequest.id == Review.service_request_id)
            .filter(
                ServiceRequest.service_id == specialization,  # Match specialization
                ServiceRequest.status == 'closed'
            )
            .all()
        )

        # Format the data for pending requests
        pending_data = [
            {
                "request_id": req.request_id,
                "customer_name": req.customer_name,
                "phone_number": req.phone_number,
                "address": req.address,
                "pincode": req.pincode,
                "remarks": req.remarks,
                "date_of_request": req.date_of_request.strftime('%Y-%m-%d %H:%M:%S'),
                "status": req.status
            }
            for req in pending_requests
        ]

        # Format the data for closed requests
        closed_data = [
            {
                "request_id": req.request_id,
                "customer_name": req.customer_name,
                "phone_number": req.phone_number,
                "address": req.address,
                "pincode": req.pincode,
                "remarks": req.remarks,
                "date_of_request": req.date_of_request.strftime('%Y-%m-%d %H:%M:%S'),
                "status": req.status,
                "rating": req.rating,
                "review": req.review
            }
            for req in closed_requests
        ]

        # Send back JSON with both lists
        return jsonify({
            "pending_requests": pending_data,
            "closed_requests": closed_data
        })


    @auth_required('token')
    @roles_required('Service Professional')  
    def put(self, request_id):
        professional_id = current_user.id

        # Fetch the service request
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404

        # Parse the action from the request body
        data = request.get_json()
        action = data.get("action")

        if action == "accept":
            # Only allow accepting unprocessed (requested) requests
            if service_request.status != 'requested' and service_request.status != 'rejected':
                return {"message": "Service request already processed"}, 400
            # Assign the professional and update the status
            service_request.professional_id = professional_id
            service_request.status = 'assigned'

        elif action == "reject":
            # Only allow rejecting unprocessed (requested) requests
            if service_request.status != 'requested' and service_request.status != 'assigned':
                return {"message": "Service request already processed"}, 400
            # Set status to rejected and remove professional_id
            service_request.status = 'rejected'
            service_request.professional_id = None  # Remove professional assignment

        else:
            return {"message": "Invalid action"}, 400

        # Save changes to the database
        db.session.commit()
        return {"message": f"Service request {action}ed successfully"}, 200
