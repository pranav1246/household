import AdminDashBoard from "./Admin/AdminDashBoard.js";
import ProfessionalDashBoard from "./Professional/ProfessionalDashBoard.js";
import CustomerDashBoard from "./Customer/CustomerDashBoard.js";
import LoginPage from "./LoginPage.js";
import Navbar from "./Navbar.js";
import CustomerSignup from "./Customer/CustomerSignup.js";
import ProfSignup from "./Professional/Signup.js";
import Search from "./Search.js";
import SummaryChart from "./Summary.js";


const Home = {
  template: `
    <v-app>
      <v-main>
        <v-container>
          <Navbar />

          <!-- Show Login Page if on Home Route and User Role is Not Defined -->
          <v-card v-if="isLoginRoute && !userRole">
            <v-card-title class="text-h5 text-center">Welcome to Our Platform</v-card-title>
            <v-card-text>
              <LoginPage />
              <div class="d-flex justify-center mt-6">
                <v-btn class="mx-2" color="success" @click="$router.push({ name: 'ProfessionalSignup' })">
                  Signup as Professional
                </v-btn>
                <v-btn class="mx-2" color="secondary" @click="$router.push({ name: 'CustomerSignup' })">
                  Signup as Customer
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Show Appropriate Component Based on Route Name -->
          <div v-else>
            <component :is="currentComponent" />
          </div>
        </v-container>
      </v-main>
    </v-app>
  `,

  computed: {
    userRole() {
      return this.$store.state.userRole || null; // Fetch user role from Vuex store
    },
    isLoginRoute() {
      return this.$route.name === 'Home'; // Define what counts as the login route
    },
    currentComponent() {
      // Determine the component to render based on the route name and user role
      if (this.$route.name === 'Search') return 'Search';
      if (this.$route.name === 'Summary') return 'SummaryChart';
      if (this.$route.name === 'CustomerSignup') return 'CustomerSignup';
      if (this.$route.name === 'ProfessionalSignup') return 'ProfSignup';

      if (this.userRole === 'Admin') return 'AdminDashBoard';
      if (this.userRole === 'Service Professional') return 'ProfessionalDashBoard';
      if (this.userRole === 'Customer') return 'CustomerDashBoard';

      return null; // Default to null if no matching route
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
  },
};

export default Home;
