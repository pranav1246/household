from flask import current_app as app, jsonify,send_file,render_template,send_from_directory
from celery.result import AsyncResult
from applications.task import export_closed_requests_as_csv
from applications.database.models import  db,Service
# from applications.instance import cache



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




# @cache.cached(timeout=500)
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

