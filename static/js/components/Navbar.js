import EditProfile from "./EditProfile.js";

export default {
  template: `
    <v-app-bar app color="primary" dark>
      <!-- Navigation Drawer Toggle -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Household Services</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Toolbar Buttons for Larger Screens -->
      <div class="d-none d-md-flex">
        <v-btn text class="mx-2" :to="{ path: '/' }">
        <v-icon left>mdi-home</v-icon>Home
        </v-btn>
        <v-btn text v-if="role" class="mx-2" :to="{ path: '/search' }">
          <v-icon>mdi-magnify</v-icon> Search
        </v-btn>
        <v-btn text v-if="role" class="mx-2" :to="{ path: '/summary' }">
        <v-icon left>mdi-chart-bar</v-icon> Summary
        </v-btn>
        <v-btn 
          text 
          class="mx-2" 
          v-if="role === 'Service Professional' || role === 'Customer'" 
          @click="showEditProfile = true"
        >
          <v-icon left>mdi-account</v-icon> Profile
        </v-btn>
        <v-btn 
          outlined 
          class="mx-2" 
          v-if="isLoggedIn" 
          @click="logout"
        >
          Logout
        </v-btn>
      </div>

      <!-- Navigation Drawer -->
      <v-navigation-drawer 
  v-model="drawer" 
  app 
  temporary 
  class="d-md-none"
>
  <v-list dense>
    <!-- Home -->
    <v-list-item :to="{ path: '/' }" router @click="drawer = false">
      <v-list-item-title><v-icon left>mdi-home</v-icon>Home</v-list-item-title>
    </v-list-item>

    <!-- Search -->
    <v-list-item v-if="role" :to="{ path: '/search' }"  @click="drawer = false">
      <v-list-item-title><v-icon left>mdi-magnify</v-icon> Search</v-list-item-title>
    </v-list-item>

    <!-- Summary -->
    <v-list-item v-if="role" :to="{ path: '/summary' }" router @click="drawer = false">
      <v-list-item-title><v-icon left>mdi-chart-bar</v-icon>Summary</v-list-item-title>
    </v-list-item>

    <!-- Profile -->
    <v-list-item 
      v-if="role === 'Service Professional' || role === 'Customer'" 
      @click="openProfile"
    >
      <v-list-item-title><v-icon left>mdi-account</v-icon> Profile</v-list-item-title>
    </v-list-item>

    <!-- Logout -->
    <v-list-item v-if="isLoggedIn" @click="handleLogout">
      <v-list-item-title>Logout</v-list-item-title>
    </v-list-item>
  </v-list>
</v-navigation-drawer>
      <!-- Profile Edit Dialog -->
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
    </v-app-bar>
  `,

  data() {
    return {
      drawer: false, 
      showEditProfile: false, 
      userRole: "", 
      userId: null,
    };
  },

  computed: {
    role() {
      return this.$store.state.userRole; 
    },
    isLoggedIn() {
      return !!this.$store.state.token; 
    },
  },

  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    async fetchUserInfo() {
      this.userRole = this.$store.state.userRole;
      this.userId = this.$store.state.user_id;
    },
    handleProfileUpdated() {
      this.showEditProfile = false;
      alert("Profile updated successfully!");
    },
    openProfile() {
      this.showEditProfile = true;
      this.drawer = false; 
    },
    handleLogout() {
      this.logout();
      this.drawer = false;
    }
  },

  components: {
    EditProfile,
  },
};
