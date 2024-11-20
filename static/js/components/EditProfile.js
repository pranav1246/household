const EditProfile = {
  template: `
    <v-container>
      <v-card>
        <v-card-title>
          <h2>Edit Profile</h2>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
          
            <v-text-field
              label="Email"
              v-model="formData.email"
              required
            ></v-text-field>


            <v-text-field
              label="Phone Number"
              v-model="formData.phone_number"
              required
            ></v-text-field>

        
            <v-text-field
              label="Address"
              v-model="formData.address"
            ></v-text-field>
            <v-text-field
              label="Pincode"
              v-model="formData.pincode"
              type="number"
            ></v-text-field>

       
            <v-text-field
              v-if="userRole === 'Service Professional'"
              label="Years of Experience"
              v-model="formData.experience_years"
              type="number"
            ></v-text-field>
  
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="submitForm">Save</v-btn>
          <v-btn color="red" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  `,
  data() {
    return {
      formData: {
        email: "",
        phone_number: "",
        address: "",
        pincode: "",
        experience_years: null,
      },
      userRole: "",
      userId: null, 
    };
  },
  methods: {
    
    async submitForm() {
      try {
        this.userRole = this.$store.state.userRole 
        this.userId = this.$store.state.user_id
        const url =
          this.userRole === "Customer"
            ? `/api/update-customer/${this.userId}`
            : `/api/update-professional/${this.userId}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization-Token": localStorage.getItem("token"),
          },
          body: JSON.stringify(this.formData),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          this.$emit("profileUpdated");
        } else {
          alert("Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    cancelEdit() {
      this.$emit("cancelEdit");
    },
  },
  created() {
    this.fetchUserProfile(); 
  },
};

export default EditProfile;
