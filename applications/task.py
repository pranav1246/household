from celery import shared_task
import requests
from applications.database.models import ServiceRequest, User,db
from flask_mail import Mail, Message
from datetime import datetime,timedelta
from flask import render_template , current_app as app
import csv
from io import StringIO



mail = Mail()

@shared_task(ignore_result=False)
def send_daily_reminders():
    pending_requests = (
        db.session.query(ServiceRequest, User)
        .join(User, ServiceRequest.professional_id == User.id)
        .filter(ServiceRequest.status.in_(["requested", "assigned"]))
        .all()
    )
    print(pending_requests)
    for request, professional in pending_requests:
        print(f"Sending reminder to {professional.name}")
        send_google_chat_message(professional.name)
    return "OK"

def send_google_chat_message(name):
    message = {
        "text": f"Hello {name}, you have pending service requests. Please accept or reject them."
    }
    headers = {"Content-Type": "application/json"}
    webhook_url='https://chat.googleapis.com/v1/spaces/AAAAN7Xs3H8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=dfDKda30Bt01VSPlm_lc_lzEC0eZ_Xj_8GY1fYN5tGE'
    response=requests.post(webhook_url, json=message, headers=headers)
    if response.status_code == 200:
        print("Message sent successfully.")
    else:
        print(f"Failed to send message: {response.status_code} - {response.text}")




@shared_task
def send_monthly_activity_report():

    now = datetime.now()
    start_date = (now.replace(day=1) - timedelta(days=1)).replace(day=1)
    end_date = now.replace(day=1) - timedelta(days=1)
    
    # Query the database for services created or closed in the previous month
    monthly_data = (
        db.session.query(ServiceRequest, User)
        .join(User, ServiceRequest.customer_id == User.id)
        .filter(ServiceRequest.date_of_request.between(start_date, end_date))
        .all()
    )
    print(monthly_data)
    # Generate report for each customer
    customer_reports = {}
    for request, customer in monthly_data:
        if customer.email not in customer_reports:
            customer_reports[customer.email] = {
                'customer_name': customer.name,
                'requested_count': 0,
                'closed_count': 0,
                'services': []
            }
        
        # Update counts based on status
        if request.status == "requested":
            customer_reports[customer.email]['requested_count'] += 1
        elif request.status == "closed":
            customer_reports[customer.email]['closed_count'] += 1
        
        # Add service detail to report
        customer_reports[customer.email]['services'].append(request)

    # Send email for each customer
    for email, report in customer_reports.items():
        send_email_report(email, report)

        

def send_email_report(email, report_data):
    # Render the email HTML template with report data
    html_content = render_template('monthly.html', report=report_data)
    
    with app.app_context(): 
        msg = Message(
            subject="Your Monthly Activity Report",
            sender="memail@example.com",
            recipients=[email],
            html=html_content
        )
        mail.send(msg)


@shared_task(ignore_result=False)
def export_closed_requests_as_csv():
    # Query data
    closed_requests = ServiceRequest.query.with_entities(
        ServiceRequest.service_id,
        ServiceRequest.customer_id,
        ServiceRequest.professional_id,
        ServiceRequest.date_of_request,
        ServiceRequest.remarks
    ).filter(ServiceRequest.status == "closed").all()
    
    # Define the CSV filename
    filename = "report.csv"
    
    # Write data to a CSV file
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow(["Service ID", "Customer ID", "Professional ID", "Date of request", "Remarks"])
        # Write data rows
        for row in closed_requests:
            writer.writerow(row)
    
    return filename
   