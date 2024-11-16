import AdminDashBoard from "./Admin/AdminDashBoard.js";
import ProfessionalDashBoard from "../Professional/ProfessionalDashBoard.js";
import CustomerDashBoard from "../Customer/CustomerDashBoard.js";

const Home = {
    template: `
      <v-container>
        <AdminDashBoard v-if="userRole==='Admin'"/>
        <ProfessionalDashBoard v-if="userRole==='Service Professional'"/>
        <CustomerDashBoard v-if="userRole==='Customer'" />
      </v-container>
    `,
    data(){
        return{
            userRole:localStorage.getItem('role'),
        }
    },
    components:{
        AdminDashBoard,
        ProfessionalDashBoard,
        CustomerDashBoard
    }
  };
  
export default Home

