from flask import jsonify,request
from flask_restful import Resource
from flask_security import auth_required, roles_required,current_user
from applications.database.models import db, ServiceRequest, User,Review,ProfessionalDetails
# from applications.instance import cache



class ProfessionalRequestsAPI(Resource):
    @auth_required('token')  
    @roles_required('Service Professional') 
    # @cache.cached(timeout=300)  
    def get(self):
        professional_id = current_user.id
        professional = ProfessionalDetails.query.filter_by(user_id=professional_id).first()

        if not professional:
            return {"message": f"Professional not found"}, 404

        specialization = professional.service_type_id

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
                ServiceRequest.service_id == specialization,
                ServiceRequest.status.in_(['requested', 'rejected'])
            )
            .all()
        )

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
                ServiceRequest.service_id == specialization,
                ServiceRequest.status == 'closed'
            )
            .all()
        )

        assigned_requests = (
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
                ServiceRequest.service_id == specialization,
                ServiceRequest.status == 'assigned',
                ServiceRequest.professional_id == professional_id
            )
            .all()
        )

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

        assigned_data = [
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
            for req in assigned_requests
        ]

        return jsonify({
            "pending_requests": pending_data,
            "closed_requests": closed_data,
            "assigned_requests": assigned_data
        })

    @auth_required('token')
    @roles_required('Service Professional')  
    def put(self, request_id):
        professional_id = current_user.id
        professional = ProfessionalDetails.query.filter_by(user_id=professional_id).first()
        if not professional:
          return {"message": "Professional not found"}, 404

        if not professional.is_active:
            return {"message": "Your account is not approved by the admin. Please contact the admin."}, 403

        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404

       
        data = request.get_json()
        action = data.get("action")

        if action == "accept":
       
            if service_request.status != 'requested' and service_request.status != 'rejected':
                return {"message": "Service request already processed"}, 400
           
            service_request.professional_id = professional_id
            service_request.status = 'assigned'

        elif action == "reject":
        
            if service_request.status != 'requested' and service_request.status != 'assigned':
                return {"message": "Service request already processed"}, 400
           
            service_request.status = 'rejected'
            service_request.professional_id = None 

        else:
            return {"message": "Invalid action"}, 400

      
        db.session.commit()
        # cache.clear()
        return {"message": f"Service request {action}ed successfully"}, 200
