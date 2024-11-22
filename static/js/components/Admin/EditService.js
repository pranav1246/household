export default Vue.component("edit-service", {
  template: `
    <v-container>
      <v-card class="mt-4">
        <v-card-title>
          <h2>{{ isEditMode ? "Edit Service" : "Add New Service" }}</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="serviceForm">
            <v-text-field
              label="Service Name"
              v-model="service.name"
              required
            ></v-text-field>
            <v-text-field
              label="Description"
              v-model="service.description"
              required
            ></v-text-field>
            <v-text-field
              label="Base Price"
              v-model="service.base_price"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              label="Duration"
              v-model="service.time_required"
              type="number"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" @click="saveService">
            {{ isEditMode ? "Save Changes" : "Add Service" }}
          </v-btn>
          <v-btn color="grey" @click="$emit('cancel')">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  `,
  props: {
    service: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isEditMode() {
      return !!this.service.id; 
    },
  },
  methods: {
    async saveService() {
      try {
        const url = this.isEditMode ? `/api/service/${this.service.id}` : "/api/add-service";
        const method = this.isEditMode ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json","Authorization-Token": localStorage.getItem("token") },
          body: JSON.stringify(this.service),
        });
        const result = await response.json();

        if (response.ok) {
          alert(this.isEditMode ? "Service updated successfully!" : "Service added successfully!");
          this.$emit("service-saved"); 
          this.$emit("cancel"); 
        } else {
          alert(result.message || "Failed to save service.");
        }
      } catch (error) {
        console.error("Error saving service:", error);
        alert("An error occurred.");
      }
    },
  },
});
