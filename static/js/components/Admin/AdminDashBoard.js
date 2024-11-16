export default Vue.component("admin-dashboard", {
    template: `
      <v-container>
        <h1 class="text-center">Admin Dashboard</h1>
  
        <!-- Services Table -->
        <v-card class="mt-4">
          <v-card-title>
            <h2>Services</h2>
          </v-card-title>
          <v-data-table
            :headers="serviceHeaders"
            :items="services"
            item-value="id"
            class="elevation-1"
            dense
            @click="showService(item.id)"
          >
           <template v-slot:item.action="{ item }">
              <v-btn small color="blue" @click="editService(item.id)">Edit</v-btn>
             
              <v-btn small color="red" @click="deleteService(item.id)">Delete</v-btn>
            </template>
          </v-data-table>
        </v-card>
  
        <v-card class="mt-4">
          <v-card-title>
            <h2>Professionals</h2>
          </v-card-title>
          <v-data-table
            :headers="professionalHeaders"
            :items="professionals"
            item-value="id"
            class="elevation-1"
            dense
          >
           <template v-slot:item.action="{ item }">
              <v-btn small color="green" @click="approveProfessional(item.id)">Approve</v-btn>
              <v-btn small color="orange" @click="rejectProfessional(item.id)">Reject</v-btn>
              <v-btn small color="red" @click="deleteProfessional(item.id)">Delete</v-btn>
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Service Requests Table -->
        <v-card class="mt-4">
          <v-card-title>
            <h2>Service Requests</h2>
          </v-card-title>
          <v-data-table
            :headers="serviceRequestHeaders"
            :items="serviceRequests"
            item-value="id"
            class="elevation-1"
            dense
          ></v-data-table>
        </v-card>
      </v-container>
    `,
    data() {
      return {
        services: [],
        professionals: [],
        serviceRequests: [],
        serviceHeaders: [
          { text: "ID", value: "id" },
          { text: "Name", value: "name" },
          { text: "Base Price", value: "base_price" },
          { text: "Action", value: "action", sortable: false },
        ],
        professionalHeaders: [
          { text: "ID", value: "id" },
          { text: "Name", value: "name" },
          { text: "Service Type", value: "service_type" },
          { text: "Experience (Years)", value: "experience_years" },
          { text: "Rating", value: "rating" },
          { text: "Active", value: "is_active" },
          { text: "Action", value: "action", sortable: false },
        ],
        serviceRequestHeaders: [
          { text: "ID", value: "id" },
          { text: "Status", value: "status" },
          { text: "Customer ID", value: "customer_id" },
          { text: "Professional ID", value: "professional_id" },
          { text: "Date of Request", value: "date_of_request" },
          { text: "Remarks", value: "remarks" },
        ],
      };
    },
    methods: {
      async fetchDashboardData() {
        try {
          const response = await fetch("/api/admin-dashboard", {
            method: "GET",
            headers: { 'aunthentication-token': localStorage.getItem("token") },
          });
          const data = await response.json();
          this.services = data.services;
          this.professionals = data.professionals;
          this.serviceRequests = data.service_requests;
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          alert("An error occurred while fetching data.");
        }
      },
      editService(serviceId) {
        console.log("Edit service:", serviceId);
        // Implement edit logic here
      },
      deleteService(serviceId) {
        console.log("Delete service:", serviceId);
        // Implement delete logic here
      },
      approveProfessional(professionalId) {
        console.log("Approve professional:", professionalId);
        // Implement approve logic here
      },
      rejectProfessional(professionalId) {
        console.log("Reject professional:", professionalId);
        // Implement reject logic here
      },
      deleteProfessional(professionalId) {
        console.log("Delete professional:", professionalId);
        // Implement delete logic here
      },
      showService(serviceID){
        console.log("here");
        
      },

      
    },
    created() {
      this.fetchDashboardData();
    },
  });
  