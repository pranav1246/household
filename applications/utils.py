from flask_restful import reqparse

def customer_signup_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True, help="Email is required")
    parser.add_argument('password', type=str, required=True, help="Password is required")
    parser.add_argument('name', type=str, required=True, help="Name is required")
    parser.add_argument('address', type=str, required=True, help="Address is required")
    parser.add_argument('pincode', type=str, required=True, help="Pincode is required")
    parser.add_argument('phone_number',type=str,help="phone no required")
    return parser

def professional_signup_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('email', type=str, required=True, help="Email is required")
    parser.add_argument('password', type=str, required=True, help="Password is required")
    parser.add_argument('name', type=str, required=True, help="Name is required")
    parser.add_argument('service_name', type=str, required=True, help="Service name is required")
    parser.add_argument('experience_years', type=int, required=True, help="Experience in years is required")
    parser.add_argument('address', type=str, required=True, help="Address is required")
    parser.add_argument('pincode', type=str, required=True, help="Pincode is required")
    parser.add_argument('phone_number',type=str,help="phone no required")
    parser.add_argument('attached_docs',type=str,help="provide valid file name")
    return parser

def service_resource_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help="Service name is required.")
    parser.add_argument('description', type=str, required=False, help="Description of the service.")
    parser.add_argument('base_price', type=float, required=True, help="Base price is required.")
    parser.add_argument('time_required', type=int, required=True, help="Estimated time in minutes.")
    return parser


def service_request_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('service_id', type=int, required=True, help="Service ID is required.")
    parser.add_argument('remarks', type=str, required=False, help="Remarks for the service request.")
    return parser

def update_service_req_parser():
        parser = reqparse.RequestParser()
        parser.add_argument('status', type=str, required=False, choices=('requested', 'assigned', 'closed'), help="Status of the service request.")
        parser.add_argument('remarks', type=str, required=False, help="Remarks or comments.")
        return parser