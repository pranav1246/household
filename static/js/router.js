import Home from "./components/Home.js"
import ProfSignup from "./components/Professional/Signup.js"
import CustomerSignup from "./components/Customer/CustomerSignup.js"
import SearchResult from "./components/Search.js"
import SummaryChart from "./components/Summary.js"
import BookService from "./components/Customer/BookService.js"
import Review from "./components/Customer/Review.js"
import LoginPage from "./components/LoginPage.js"


const routes=[
  {path: '/',name: 'Home',component: Home,},
  { path: "/customer-signup", name: "CustomerSignup", component: CustomerSignup },
  { path: "/professional-signup", name: "ProfessionalSignup", component: ProfSignup },
  {path:"/search",name: "Search" , component:SearchResult},
  {path:"/summary",name:"Summary",component:SummaryChart},
  {path:'/book-service',name:'BookService',component:BookService},
  {path:'/review',name:'Review',component:Review},
 {path:'/login',name:'Login',component:LoginPage}
]

export default new VueRouter({
    routes,
})
