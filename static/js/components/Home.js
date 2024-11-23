import AdminDashBoard from "./Admin/AdminDashBoard.js";
import ProfessionalDashBoard from "./Professional/ProfessionalDashBoard.js";
import CustomerDashBoard from "./Customer/CustomerDashBoard.js";
import LoginPage from "./LoginPage.js";
import Navbar from "./Navbar.js";
import CustomerSignup from "./Customer/CustomerSignup.js";
import ProfSignup from "./Professional/Signup.js";
import Search from "./Search.js";
import SummaryChart from "./Summary.js";
import Footer from "./Footer.js";

const Home = {
  template: `
    <v-app>
      <v-main>
        <v-container>
          <Navbar />

          <!-- Welcome Card -->
          <v-card
            v-if="isLoginRoute && !userRole"
            class="pa-6 my-10"
            elevation="10"
            style="background: linear-gradient(to bottom right, #1e88e5, #64b5f6); color: white;"
          >
            <v-card-title class="text-h5 text-center" style="font-weight: bold;">
              Welcome to Household Services
            </v-card-title>
            <v-card-text>
             
                <LoginPage />
                <div class="d-flex justify-center mt-6">
                  <v-btn
                    class="mx-2"
                    color="success"
                    large
                    elevation="5"
                    @click="$router.push({ name: 'ProfessionalSignup' })"
                  >
                    Signup as Professional
                  </v-btn>
                  <v-btn
                    class="mx-2"
                    color="secondary"
                    large
                    elevation="5"
                    @click="$router.push({ name: 'CustomerSignup' })"
                  >
                    Signup as Customer
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Dashboard / Other Components -->
          <v-card v-else elevation="5" class="fade-in-animation">
            <component :is="currentComponent" />
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  
  `,
  computed: {
    userRole() {
      return this.$store.state.userRole || null; 
    },
    isLoginRoute() {
      return this.$route.name === 'Home'; 
    },
    currentComponent() {
      if (this.$route.name === 'Search') return 'Search';
      if (this.$route.name === 'Summary') return 'SummaryChart';
      if (this.$route.name === 'CustomerSignup') return 'CustomerSignup';
      if (this.$route.name === 'ProfessionalSignup') return 'ProfSignup';

      if (this.userRole === 'Admin') return 'AdminDashBoard';
      if (this.userRole === 'Service Professional') return 'ProfessionalDashBoard';
      if (this.userRole === 'Customer') return 'CustomerDashBoard';

      return null;
    },
  },
  components: {
    AdminDashBoard,
    ProfessionalDashBoard,
    CustomerDashBoard,
    LoginPage,
    Navbar,
    CustomerSignup,
    ProfSignup,
    Search,
    SummaryChart,
    Footer
  },
};

export default Home;
