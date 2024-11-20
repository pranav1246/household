import EditProfile from "./EditProfile.js";
export default {
  template: `
    <v-app-bar app color="primary" dark>
      <!-- App Name or Logo -->
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>My App</v-toolbar-title>
      <v-spacer></v-spacer>

   
      <v-btn text class="mx-2" :to="{ path: '/' }">
        Home
      </v-btn>
      <v-btn text class="mx-2" :to="{ path: '/search' }">
        Search
      </v-btn>
      <v-btn text class="mx-2" :to="{ path: '/summary' }">
        Summary
      </v-btn>

      
      <v-btn 
        text 
        class="mx-2" 
        v-if="role === 'Service Professional' || role === 'Customer'" 
        @click="showEditProfile = true"
      >
        <v-icon left>mdi-account</v-icon> Profile
      </v-btn>

      <v-dialog v-model="showEditProfile" max-width="600px">
      <v-card>
        <edit-profile
          :user-role="userRole"
          :user-id="userId"
          @profileUpdated="handleProfileUpdated"
          @cancelEdit="showEditProfile = false"
        />

      </v-card>
    </v-dialog>

      <!-- Logout Button -->
      <v-btn 
        outlined 
        class="mx-2" 
        v-if="isLoggedIn" 
        @click="logout"
      >
        Logout
      </v-btn>
    </v-app-bar>
  `,

  computed: {
    role() {
      return this.$store.state.userRole; 
    },
    isLoggedIn() {
      return !!this.$store.state.token; 
    },
  },
  data() {
    return {
      showEditProfile: false, // Toggles the modal
      userRole: "", // To store the role of the logged-in user
      userId: null, // To store the ID of the logged-in user
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      localStorage.setItem('user_id')
    },
    async fetchUserInfo() {
      
        this.userRole =$store.state.userRole
        this.userId =$store.state.user_id
      
    },
    handleProfileUpdated() {
      this.showEditProfile = false;
      alert("Profile updated successfully!");
    },
  },
  components:{EditProfile},
};
