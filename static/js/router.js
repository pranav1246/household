import Home from "./components/Home.js"
import ProfSignup from "./components/Professional/Signup.js"
import CustomerSignup from "./components/Customer/CustomerSignup.js"



const routes=[
  {path: '/',name: 'Home',component: Home,},
{ path: "/customer-signup", name: "CustomerSignup", component: CustomerSignup },
  { path: "/professional-signup", name: "ProfessionalSignup", component: ProfSignup },
]

export default new VueRouter({
    routes,
})
