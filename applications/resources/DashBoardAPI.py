from flask import jsonify
from flask_restful import Resource
from sqlalchemy import func
from applications.database.models import Review, ServiceRequest, db


class DashboardStatsAPI(Resource):
    def get(self):
        try:
            # Query for rating counts (1 to 5)
            rating_counts = (
                db.session.query(Review.rating, func.count(Review.id))
                .group_by(Review.rating)
                .all()
            )
            
            # Initialize array with zeros for ratings 1 to 5
            rating_data = [0] * 5
            for rating, count in rating_counts:
                # Ensure rating is an integer and within the valid range
                if isinstance(rating, float):  # Check if rating is a float
                    rating = int(rating)  # Convert float to integer
                if 1 <= rating <= 5:  # Ensure rating is within range
                    rating_data[rating - 1] = count
            
            # Query for service request counts by status
            service_request_counts = (
                db.session.query(ServiceRequest.status, func.count(ServiceRequest.id))
                .group_by(ServiceRequest.status)
                .all()
            )

            # Initialize dictionary for service request statuses
            status_data = {"requested": 0, "rejected": 0, "assigned": 0, "closed": 0}
            for status, count in service_request_counts:
                if status in status_data:
                    status_data[status] = count

            # Combine results
            response = {
                "rating_counts": rating_data,
                "service_request_counts": status_data,
            }

            return jsonify(response)

        except Exception as e:
            return {"error": "An error occurred while fetching data", "details": str(e)}, 500
