from flask import request, jsonify
from flask_restful import Resource
from flask_security import auth_required, roles_required
from applications.database.models import Review, ServiceRequest, db
from datetime import datetime

class AddReviewAPI(Resource):
    # @auth_required("token")  
    # @roles_required("Customer")  
    def post(self):
        data = request.get_json()
        
        # Required fields
        service_request_id = data.get("service_request_id")
        rating = data.get("rating")
        
        if not service_request_id or not rating:
            return {"message": "Service request ID and rating are required."}, 400
        
        # Validate that the service request exists and is associated with this customer
        service_request = ServiceRequest.query.filter_by(
            id=service_request_id,
            customer_id= 2     #request.user.id  # Assuming `request.user` provides current authenticated user
        ).first()
        
        if not service_request:
            return {"message": "Service request not found or not accessible by this customer."}, 404

        # Check if review already exists for this service request
        if service_request.review:
            return {"message": "Review already exists for this service request."}, 400
        
        # Create a new review
        review = Review(
            service_request_id=service_request_id,
            customer_id=2,    #request.user.id,
            rating=rating,
            comments=data.get("comments", ""),
            date_posted=datetime.now()
        )
        
        # Add the review to the database
        db.session.add(review)
        db.session.commit()
        
        return {"message": "Review added successfully"}, 201
