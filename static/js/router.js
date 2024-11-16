import LoginPage from "./components/LoginPage.js"
import Home from "./components/Home.js"




const routes=[
    {path:'/',component:Home, name:'Home'},
    {path:'/login',component:LoginPage, name:'Login' },
    // {path:'/users',component:Users}
]

export default new VueRouter({
    routes,
})
