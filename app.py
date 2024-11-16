from flask import Flask
from applications.database.models import db
from config import Config
from flask_security import Security
from applications.database.sec import datastore
from flask_migrate import Migrate
import flask_excel as excel
from flask_mail import Mail
from applications.routes import api
from applications.workers import celery_init_app
from applications.task import send_daily_reminders, send_monthly_activity_report, export_closed_requests_as_csv
mail = Mail()


def create_app():
    app=Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security=Security(app,datastore)
    mail.init_app(app)
    with app.app_context():
        import applications.views

    return app

app=create_app()
migrate = Migrate(app, db)
celery_app=celery_init_app(app)


@celery_app.on_after_configure.connect
def send_daily_remain(sender,**kwargs):
    sender.add_periodic_task(10.0,send_daily_reminders.s())

@celery_app.on_after_configure.connect
def send_montly_report(sender,**kwargs):
    sender.add_periodic_task(20.0,send_monthly_activity_report.s())



if __name__=='__main__':
    app.run(debug=True,port=5001)


