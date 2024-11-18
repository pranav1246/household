export default {
  template: `
    <v-app-bar app color="primary" dark>
      <!-- App Name or Logo -->
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>My App</v-toolbar-title>

      <!-- Spacer pushes the remaining items to the right -->
      <v-spacer></v-spacer>

      <!-- Navigation Buttons -->
      <v-btn text class="mx-2" :to="{ path: '/' }">
        <v-icon left>mdi-home</v-icon> Home
      </v-btn>
      <v-btn text class="mx-2" :to="{ path: '/search' }">
        <v-icon left>mdi-magnify</v-icon> Search
      </v-btn>
      <v-btn text class="mx-2" :to="{ path: '/summary' }">
        <v-icon left>mdi-chart-bar</v-icon> Summary
      </v-btn>

      <!-- Profile Button (Professionals & Customers Only) -->
      <v-btn 
        text 
        class="mx-2" 
        v-if="role === 'Professional' || role === 'Customer'" 
        :to="{ path: '/profile' }"
      >
        <v-icon left>mdi-account</v-icon> Profile
      </v-btn>

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
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
