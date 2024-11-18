from flask import current_app as app, jsonify,send_file,render_template,send_from_directory
from celery.result import AsyncResult
from applications.task import export_closed_requests_as_csv


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
