from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import datetime

db = SQLAlchemy()


roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean(), default=True)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    address = db.Column(db.String(255))  # Add this line for address
    pincode = db.Column(db.String(10))

    # Relationships
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
    professional = db.relationship('ProfessionalDetails', uselist=False, backref='user')
    service_requests = db.relationship('ServiceRequest', backref='customer', lazy=True)
    reviews = db.relationship('Review', backref='customer', lazy=True)


class Service(db.Model):
    __tablename__ = 'service'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)  # in minutes
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now)


    service_requests = db.relationship('ServiceRequest', backref='service', lazy=True)
    professionals = db.relationship('ProfessionalDetails', backref='service_type', lazy=True)


class ProfessionalDetails(db.Model):
    __tablename__ = 'professional_details'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    experience_years = db.Column(db.Integer, nullable=False)
    service_type_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    rating = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Boolean, default=False)
    attached_docs_path = db.Column(db.String(255))
    date_created = db.Column(db.DateTime, default=datetime.now)

    # Relationships
    assigned_requests = db.relationship('ServiceRequest', backref='professional', lazy=True)

    
class ServiceRequest(db.Model):
    __tablename__ = 'service_request'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professional_details.id'), nullable=True)
    date_of_request = db.Column(db.DateTime, default=datetime.now)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='requested')  # 'requested', 'assigned', 'closed'
    remarks = db.Column(db.Text, nullable=True)

  

class Review(db.Model):
    __tablename__ = 'review'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    service_request_id = db.Column(db.Integer, db.ForeignKey('service_request.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comments = db.Column(db.Text, nullable=True)
    date_posted = db.Column(db.DateTime, default=datetime.now)

    # Relationships
    service_request = db.relationship('ServiceRequest', backref='review', uselist=False)

    
