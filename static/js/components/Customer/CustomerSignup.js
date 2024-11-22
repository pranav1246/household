const CustomerSignup = {
    template: `
      <v-container>
        <v-card class="mx-auto mt-10" max-width="600">
          <v-card-title class="text-h5 text-center">Signup as a Customer</v-card-title>
          <v-card-text>
            <v-form v-model="formValid" ref="form">
              <v-text-field
                v-model="form.name"
                label="Full Name"
                required
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <v-text-field
                v-model="form.phone_number"
                label="Phone Number"
                type="tel"
                required
                :rules="[rules.required, rules.phone]"
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                required
                :rules="[rules.required, rules.minLength(6)]"
              ></v-text-field>
              <v-textarea
                v-model="form.address"
                label="Address"
                required
                :rules="[rules.required]"
              ></v-textarea>
              <v-text-field
                v-model="form.pincode"
                label="Pincode"
                type="number"
                required
                :rules="[rules.required, rules.pincode]"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!formValid"
              color="success"
              block
              @click="submitForm"
            >
              Signup
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    `,
    data() {
      return {
        form: {
          name: "",
          email: "",
          phone_number: "",
          password: "",
          address: "",
          pincode: "",
        },
        formValid: false,
        rules: {
          required: (value) => !!value || "This field is required",
          email: (value) => /.+@.+\..+/.test(value) || "Invalid email address",
          phone: (value) => /^[0-9]{10}$/.test(value) || "Invalid phone number",
          pincode: (value) =>
            /^[0-9]{6}$/.test(value) || "Pincode must be 6 digits",
          minLength: (min) => (value) =>
            value.length >= min || `Minimum ${min} characters required`,
        },
      };
    },
    methods: {
      async submitForm() {
        if (this.$refs.form.validate()) {
          try {
            const response = await fetch(
              "/api/signup/customer",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.form),
              }
            );
  
            if (response.ok) {
                alert("Signup successful! Please log in.")
              this.$router.push({ name: "Home" });
            } else {
                
              const error = await response.json();
              alert(error.message)
           
            }
          } catch (err) {
            alert("An error occurred. Please try again.");
          }
        }
      },
    },
  };
  
  export default CustomerSignup;
  