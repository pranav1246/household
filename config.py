
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///household_services.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT') or 'my_precious_two'
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False  
    SECURITY_PASSWORD_HASH = 'bcrypt' 
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization-Token'
    MAIL_SERVER = 'localhost'      
    MAIL_PORT = 1025                      
    MAIL_USERNAME = 'memail@example.com'
    MAIL_PASSWORD = ''
    MAIL_DEFAULT_SENDER = 'memail@example.com'