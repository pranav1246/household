import os

class Config:
   
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT', 'my_precious_two')
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization-Token'
    SECURITY_TOKEN_AUTHENTICATION_METHODS = ['token']
    WTF_CSRF_ENABLED = False
    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 0
    CACHE_DEFAULT_TIMEOUT = 500

class DevelopmentConfig(Config):
 
    SQLALCHEMY_DATABASE_URI = 'sqlite:///household_services.db'
    MAIL_SERVER = 'localhost'
    MAIL_PORT = 1025
    MAIL_USERNAME = 'memail@example.com'
    MAIL_PASSWORD = ''
    MAIL_DEFAULT_SENDER = 'memail@example.com'
    DEBUG = True

class ProductionConfig(Config):
   
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///household_services_prod.db')
    CACHE_REDIS_URL = os.environ.get('REDIS_URL')
    MAIL_SERVER = None  
    MAIL_PORT = None
    MAIL_USERNAME = None
    MAIL_PASSWORD = None
    MAIL_DEFAULT_SENDER = None
    DEBUG = False
