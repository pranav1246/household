export default Vue.component("professional-signup", {
    template:`
    <v-container >
    <v-card class="mx-auto mt-10" max-width="600">
      <v-card-title class="text-h5 text-center">Professional Signup</v-card-title>

      <v-card-text>
        <v-form ref="signupForm" @submit.prevent="submitForm">
          <!-- Name Field -->
          <v-text-field
            v-model="formData.name"
            label="Name"
            required
          ></v-text-field>

          <!-- Email Field -->
          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            required
          ></v-text-field>

          <!-- Password Field -->
          <v-text-field
            v-model="formData.password"
            label="Password"
            type="password"
            required
          ></v-text-field>

          <!-- Phone Number Field -->
          <v-text-field
            v-model="formData.phone_number"
            label="Phone Number"
            type="tel"
            required
          ></v-text-field>

          <!-- Experience Years Field -->
          <v-text-field
            v-model="formData.experience_years"
            label="Years of Experience"
            type="number"
            required
          ></v-text-field>

          <!-- Address Field -->
          <v-textarea
            v-model="formData.address"
            label="Address"
            required
          ></v-textarea>

          <!-- Pincode Field -->
          <v-text-field
            v-model="formData.pincode"
            label="Pincode"
            type="number"
            required
          ></v-text-field>

          <v-select
          :items="serviceTypes"
          item-text="name"
          item-value="id"
          label="Service Type"
          v-model="formData.service_name"
          required
        ></v-select>

          <!-- File Upload Field -->
          <v-file-input
            v-model="attachedDocs"
            label="Upload Documents"
            show-size
            truncate-length="30"
            required
            accept=".pdf,.doc,.docx,.png,.jpg"
          ></v-file-input>

          <!-- Submit Button -->
          <v-btn
            class="mt-4"
            color="primary"
            type="submit"
            block
            :loading="loading"
          >
            Sign Up
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
    `,
    data() {
        return {
          formData: {
            name: "",
            email: "",
            password: "",
            phone_number: "",
            experience_years: "",
            address: "",
            pincode: "",
            service_name: "",
          },
          attachedDocs: null,
          loading: false,
          serviceTypes: [], 
      formData: {
        service_type_id: null,
      },
        };
      },
      methods: {
        async submitForm() {
          if (!this.attachedDocs) {
            alert("Please upload your documents.");
            return;
          }
    
          this.loading = true;
          try {
            const formData = new FormData();
            Object.keys(this.formData).forEach((key) => {
              formData.append(key, this.formData[key]);
            });
    
            // Append file
            formData.append("attached_docs", this.attachedDocs);
    
            const response = await fetch("/api/signup/professional", {
              method: "POST",
              body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
              alert("Professional signed up successfully!");
              this.resetForm();
            } else {
              alert(result.message || "Failed to sign up.");
            }
          } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred while signing up.");
          } finally {
            this.loading = false;
          }
        },
        resetForm() {
          this.formData = {
            name: "",
            email: "",
            password: "",
            phone_number: "",
            experience_years: "",
            address: "",
            pincode: "",
            service_name: "",
          };
          this.attachedDocs = null;
        },
        async fetchServiceTypes() {
          try {
            const response = await fetch("/all-service");
            if (response.ok) {
              const data = await response.json();
              this.serviceTypes = data.service_types; 
            } else {
              alert("Failed to fetch service types.");
            }
          } catch (error) {
            console.error("Error fetching service types:", error);
            alert("An error occurred while fetching service types.");
          }
        },
      },
      created() {
        this.fetchServiceTypes(); 
      },
    });
