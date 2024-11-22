import os
from flask import Flask
from applications.database.models import db
from config import DevelopmentConfig,ProductionConfig
from flask_security import Security
from applications.database.sec import datastore
from flask_migrate import Migrate
import flask_excel as excel
from flask_mail import Mail
from applications.routes import api
from applications.workers import celery_init_app
from applications.task import send_daily_reminders, send_monthly_activity_report
from applications.instance import cache
from celery.schedules import crontab

mail = Mail()

env=os.environ.get('FLASK_EVN','development')


def create_app():
    
    app=Flask(__name__)
    if env == 'production':
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security=Security(app,datastore)
    mail.init_app(app)
    cache.init_app(app)
    with app.app_context():
        import applications.views
    app.app_context().push()

    return app

app=create_app()
migrate = Migrate(app, db)
celery_app=celery_init_app(app)


@celery_app.on_after_configure.connect
def send_daily_remain(sender,**kwargs):
    sender.add_periodic_task(crontab(hour=10, minute=0),
                             send_daily_reminders.s(),
                             name="Send daily reminders at 10 AM")

@celery_app.on_after_configure.connect
def send_montly_report(sender,**kwargs):
    sender.add_periodic_task(crontab(day_of_month=1, hour=10, minute=0),
                             send_monthly_activity_report.s(),
                             name="Send monthly report on the 1st day of the month at 10 AM")



if __name__=='__main__':
    app.run(debug=True,port=5001)


