from flask import current_app as app, jsonify,send_file,render_template,send_from_directory,request
from celery.result import AsyncResult
from applications.task import export_closed_requests_as_csv
from flask_security import auth_required, roles_required,current_user
from applications.database.models import User,ProfessionalDetails , db,Service


@app.get('/download-csv')
def download_csv():
   task= export_closed_requests_as_csv.delay()
   return jsonify({"task_id":task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res=AsyncResult(task_id)
    if res.ready():
        filename=res.result
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"message":"Task pending"}),404
    
@app.get('/')
def home():
    return render_template('index.html')


@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory('uploads', filename)


@app.route('/api/edit-profile', methods=['PUT'])
@auth_required('token')
@roles_required(['Service Professional','Customer'])
def edit_profile():
    user_id = current_user.id  
    data = request.get_json()
    name = data.get('name')
    phone_number = data.get('phone_number')
    address = data.get('address')
    pincode = data.get('pincode')

    service_type_id = data.get('service_type_id')
    experience_years = data.get('experience_years')
    try:
     
        user = User.query.get(user_id)
        professional_details = ProfessionalDetails.query.filter_by(user_id=user_id).first()

        if not user or not professional_details:
            return {"message": " profile not found"}, 404
        if name:
            user.name = name
        if phone_number:
            user.phone_number = phone_number
        if address:
            user.address = address
        if pincode:
            user.pincode = pincode

        if service_type_id:
            professional_details.service_type_id = service_type_id
        if experience_years:
            professional_details.experience_years = experience_years
       

        db.session.commit()
        return {"message": "Professional profile updated successfully"}, 200

    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return {"message": f"An error occurred: {str(e)}"}, 500


@app.get("/all-service")
def get_service_types():
    try:
        service_types = Service.query.all()
        service_types_list = [
            {"id": service_type.id, "name": service_type.name} for service_type in service_types
        ]
        return {"service_types": service_types_list}, 200
    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}, 500

