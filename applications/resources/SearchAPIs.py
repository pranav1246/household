from flask import request, jsonify
from flask_restful import Resource
from datetime import datetime
from sqlalchemy import or_,String
from applications.database.models import Service, ProfessionalDetails, User, ServiceRequest


class GlobalSearchAPI(Resource):
    def get(self):
        # Get the search query from the request
        search_query = request.args.get("query", "").strip()
        
        if not search_query:
            return {"error": "Query parameter is required"}, 400

        # Prepare the search results
        response_data = {
            "services": [],
            "professionals": [],
            "customers": [],
            "service_requests": []
        }

        try:
            # Match services by name
            services = Service.query.filter(Service.name.ilike(f"%{search_query}%")).all()
            response_data["services"] = [
                {
                    "id": service.id,
                    "name": service.name,
                    "description": service.description,
                    "base_price": service.base_price
                }
                for service in services
            ]

            # Match professionals by name
            professionals = (
                ProfessionalDetails.query.join(User)
                .filter(User.name.ilike(f"%{search_query}%"))
                .all()
            )
            response_data["professionals"] = [
                {"id": prof.id, "name": prof.user.name, "service": prof.service_type.name}
                for prof in professionals
            ]

            # Match customers by name
            customers = (
                ServiceRequest.query.join(User, ServiceRequest.customer_id == User.id)
                .filter(User.name.ilike(f"%{search_query}%"))
                .all()
            )
            response_data["customers"] = [
                {"id": req.id, "customer_name": req.customer.name, "status": req.status}
                for req in customers
            ]

            # Match service requests by address, pincode, or date
            service_requests_query = ServiceRequest.query.join(
                User, ServiceRequest.customer_id == User.id
            ).filter(
                or_(
                    User.address.ilike(f"%{search_query}%"),
                    User.pincode.cast(String).ilike(f"%{search_query}%")
                )
            )

            # Try parsing the query as a date
            try:
                parsed_date = datetime.strptime(search_query, "%Y-%m-%d")
                service_requests_query = service_requests_query.filter(ServiceRequest.date_of_request == parsed_date)
            except ValueError:
                pass  # If it's not a date, ignore this filter

            service_requests = service_requests_query.all()
            response_data["service_requests"] = [
                {
                    "id": req.id,
                    "service_name": req.service.name,
                    "status": req.status,
                    "customer_address": req.customer.address,
                    "customer_pincode": req.customer.pincode,
                    "date_of_request": req.date_of_request.strftime("%Y-%m-%d")
                }
                for req in service_requests
            ]

        except Exception as e:
            return {"error": "An error occurred while searching", "details": str(e)}, 500

        return jsonify(response_data)
