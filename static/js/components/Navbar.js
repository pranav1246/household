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

      <!-- Profile Button (Professionals & Customers Only) -->
      <v-btn 
        text 
        class="mx-2" 
        v-if="role === 'Service Professional' || role === 'Customer'" 
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
