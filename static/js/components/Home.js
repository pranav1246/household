import AdminDashBoard from "./Admin/AdminDashBoard.js";
import ProfessionalDashBoard from "./Professional/ProfessionalDashBoard.js";
import CustomerDashBoard from "./Customer/CustomerDashBoard.js";
import LoginPage from "./LoginPage.js";
import Navbar from "./Navbar.js";
import CustomerSignup from "./Customer/CustomerSignup.js";
import ProfSignup from "./Professional/Signup.js";

const Home = {
  template: `
    <v-app>
      <v-main>
        <v-container>
          <Navbar />
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
          <div v-else>
            <CustomerSignup v-if="$route.name==='CustomerSignup'" />
            <ProfSignup v-if="$route.name==='ProfessionalSignup'" />
            <AdminDashBoard v-if="userRole === 'Admin'" />
            <ProfessionalDashBoard v-if="userRole === 'Service Professional'" />
            <CustomerDashBoard v-if="userRole === 'Customer'" />
          </div>
        </v-container>
      </v-main>
    </v-app>
  `,
  computed: {
    userRole() {
      return this.$store.state.userRole || null;
    },
    isLoginRoute() {
      console.log('Current route name:', this.$route.name);
      return this.$route.name === 'Home' || this.$route.name===null
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
  },
};

export default Home;