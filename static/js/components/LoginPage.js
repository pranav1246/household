export default Vue.component("login-form", {
  template: `
    <v-card class="pa-5 mx-auto" max-width="400">
      <v-card-title class="headline">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            outlined
            required
          ></v-text-field>
          <v-btn color="primary" block class="mt-4" type="submit">
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  `,
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("/api/user-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "email": this.email, "password": this.password }),
        });

        const result = await response.json();
        console.log(result)
        if (response.ok) {
          this.$store.dispatch('login', { role: result.role, token:result.token ,user_id:result.user_id});
        } else {
          alert(result.message || "Login failed.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred.");
      }
    },
  },
    
});