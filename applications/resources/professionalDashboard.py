from flask import jsonify,request
from flask_restful import Resource
from flask_security import auth_required, roles_required,current_user
from applications.database.models import db, ServiceRequest, User,Review
from datetime import datetime

class ProfessionalRequestsAPI(Resource):
    # @auth_required('token')  # Ensure the user is authenticated
    # @roles_required('Service Professional')  # Accessible only by users with the Professional role
    def get(self):
        # Query pending service requests
        pending_requests = (
            db.session.query(
                ServiceRequest.id.label("request_id"),
                User.name.label("customer_name"),
                User.phone_number,
                User.address,
                User.pincode,
                ServiceRequest.status
            )
            .join(User, ServiceRequest.customer_id == User.id)
            .filter(ServiceRequest.status.in_(['assigned', 'requested']))
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
                ServiceRequest.status,
                Review.rating,
                Review.comments.label("review")
            )
            .join(User, ServiceRequest.customer_id == User.id)
            .outerjoin(Review, ServiceRequest.id == Review.service_request_id)
            .filter(ServiceRequest.status == 'closed')
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
    # @auth_required('token')
    # @roles_required('Service Professional')  
    def put(self, request_id):
        professional_id = current_user.id

        # Fetch the service request
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404

        # Check if the service request is completed
        if service_request.status == 'closed':
            return {"message": "Service request is already closed"}, 400

        # Get the action (accept, reject, close)
        data = request.get_json()
        action = data.get("action")

        if action == "accept":
            # Only unassigned requests can be accepted
            if service_request.status != 'requested':
                return {"message": "Service request already processed"}, 400
            # Update professional_id and status
            service_request.professional_id = professional_id
            service_request.status = 'assigned'

        elif action == "reject":
            # Only unassigned requests can be rejected
            if service_request.status != 'requested':
                return {"message": "Service request already processed"}, 400
            # Update status to rejected
            service_request.status = 'rejected'

        elif action == "close":
            # Only assigned requests can be closed
            if service_request.status != 'assigned':
                return {"message": "Service request cannot be closed in its current state"}, 400
            # Update status to closed and set the date_of_completion
            service_request.status = 'closed'
            service_request.date_of_completion = datetime.now()

        else:
            return {"message": "Invalid action"}, 400

        # Commit changes to the database
        db.session.commit()
        return {"message": f"Service request {action}ed successfully"}, 200
        