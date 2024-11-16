from flask import jsonify, make_response
from flask_restful import Resource
from flask_security import auth_required

class LogoutAPI(Resource):
    # Ensures the user is authenticated before logout
    def post(self):
        # Create the response directly with make_response
        response = make_response({"message": "Successfully logged out"}, 200)
        response.delete_cookie("session")  # Replace "session" with your actual cookie name if different

        return response
