const EditProfile={
template:`
<v-container>
  <v-form ref="form" v-model="valid">
    <v-text-field label="Name" v-model="formData.name" required></v-text-field>
    <v-text-field label="Phone Number" v-model="formData.phone_number" required></v-text-field>
    <v-text-field label="Address" v-model="formData.address"></v-text-field>
    <v-text-field label="Pincode" v-model="formData.pincode"></v-text-field>
    <v-select
      :items="serviceTypes"
      label="Service Type"
      v-model="formData.service_type_id"
      required
    ></v-select>
    <v-text-field
      label="Experience (Years)"
      v-model="formData.experience_years"
      type="number"
      required
    ></v-text-field>
    <v-switch label="Active" v-model="formData.is_active"></v-switch>
    <v-btn color="primary" @click="saveProfile">Save</v-btn>
  </v-form>
</v-container>
`,
data() {
    return {
      valid: true,
      serviceTypes: [], 
      formData: {
        name: "",
        phone_number: "",
        address: "",
        pincode: "",
        service_type_id: null,
        experience_years: null,
        is_active: true,
      },
    };
  },
  methods: {
    async saveProfile() {
      try {
        const response = await fetch("/api/edit-professional-profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formData),
        });

        if (response.ok) {
          alert("Profile updated successfully!");
        } else {
          const error = await response.json();
          alert(error.message || "Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred.");
      }
    },
  },
  created() {
    // Fetch existing profile data to populate the form
    this.fetchProfileData();
  },
  async fetchProfileData() {
    try {
      const response = await fetch("/api/professional-profile");
      if (response.ok) {
        const data = await response.json();
        this.formData = data;
      } else {
        alert("Failed to load profile data.");
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  },
};
