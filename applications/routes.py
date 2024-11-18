from flask_restful import Api
from applications.resources.signup import CustomerSignup, ProfessionalSignup
from applications.resources.auth import UserLogin
from applications.resources.service import ServiceResource
from applications.resources.service_request import ServiceRequestResource
from applications.resources.adminDashboard import AdminDashboardResource
from applications.resources.professionalDashboard import ProfessionalRequestsAPI
from applications.resources.customerDashbaord import CustomerDashboardAPI
from applications.resources.SearchAPIs import AdminSearchAPI,CustomerSearchAPI,ProfessionalSearchAPI
from applications.resources.addReview import AddReviewAPI
from applications.resources.UpdateUSer import UpdateCustomerDetailsAPI,UpdateProfessionalDetailsAPI

api=Api(prefix='/api')


api.add_resource(CustomerSignup, '/signup/customer')
api.add_resource(ProfessionalSignup, '/signup/professional')
api.add_resource(UserLogin,'/user-login')
api.add_resource(ServiceResource,'/add-service','/service/<int:service_id>')
api.add_resource(ServiceRequestResource,'/service-request','/service-request/<int:request_id>')
api.add_resource(AdminDashboardResource,'/admin-dashboard','/change-status','/delete-professional/<int:professional_id>')
api.add_resource(ProfessionalRequestsAPI, '/professional-dashboard','/accept-reject-service/<int:request_id>')
api.add_resource(CustomerDashboardAPI, '/customer-dashboard','/close-service/<int:request_id>')
api.add_resource(AdminSearchAPI, '/admin/search')
api.add_resource(ProfessionalSearchAPI, '/professional/search')
api.add_resource(CustomerSearchAPI, '/customer/search')
api.add_resource(AddReviewAPI, '/add-review')
api.add_resource(UpdateCustomerDetailsAPI, '/update-customer/<int:customer_id>')
api.add_resource(UpdateProfessionalDetailsAPI, '/update-professional/<int:professional_id>')




