from flask import request
from flask_restful import Resource
from flask_security.utils import verify_password
from applications.database.models import User
from applications.database.sec import datastore

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")

        if not email:
            return {"message": "email not provided"}, 400

        user = datastore.find_user(email=email)
        if not user:
            return {"message": "user not found"}, 404
        if verify_password( data.get("password"),user.password):
            return {"token":user.get_auth_token(),"user_id":user.id,"role":user.roles[0].name }

        else:
            return {"message": "wrong password"}, 400

