export default {
    template: `
      <v-app-bar app color="primary" dark>
        <!-- App Name or Logo -->
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>My App</v-toolbar-title>
  
        <!-- Spacer pushes the remaining items to the right -->
        <v-spacer></v-spacer>
  
    
        <v-btn text class="mx-2" :to="{ path: '/' }">
          <v-icon left>mdi-home</v-icon> Home
        </v-btn>
        <v-btn text class="mx-2" :to="{ path: '/search' }">
          <v-icon left>mdi-magnify</v-icon> Search
        </v-btn>
        <v-btn text class="mx-2" :to="{ path: '/summary' }">
          <v-icon left>mdi-chart-bar</v-icon> Summary
        </v-btn>
  
        <!-- Conditional Admin Section -->
        <v-btn text class="mx-2" v-if="role === 'Admin'" :to="{ path: '/user-management' }">
          <v-icon left>mdi-account-group</v-icon> Add New Service
        </v-btn>
  
        <!-- Logout Button -->
        <v-btn outlined  class="mx-2"  @click="logout">
          <v-icon left>mdi-logout</v-icon> Logout
        </v-btn>
      </v-app-bar>
    `,
    data() {
      return {
        role: localStorage.getItem('role'), // Get role from localStorage
        is_login: localStorage.getItem('token'), // Check if user is logged in
      };
    },
    methods: {
      logout() {
        // Clear localStorage and redirect to login page
        localStorage.removeItem('auth-token');
        localStorage.removeItem('role');
        this.$router.push({ path: '/login' });
      },
    },
  };
  