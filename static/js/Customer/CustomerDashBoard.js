export default Vue.component("customer-dashboard", {
    template: `
      <v-container>
        <v-row>
          <v-col>
            <h1>Customer Dashboard</h1>
          </v-col>
        </v-row>
  
        <!-- Available Services Carousel -->
        <v-row>
          <v-col>
            <h2>Looking for?</h2>
            <v-carousel>
              <v-carousel-item
                v-for="(service, index) in availableServices"
                :key="index"
              >
                <v-card>
                  <v-img
                    src="https://img.freepik.com/premium-photo/male-hand-touching-service-concept_220873-7591.jpg?semt=ais_hybrid"
                    alt="Service"
                    aspect-ratio="16/9"
                  ></v-img>
                  <v-card-title class="justify-center">{{ service.name }}</v-card-title>
                </v-card>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
  
        <!-- Service History Table -->
        <v-row>
          <v-col>
            <h2>Service History</h2>
            <v-data-table
              :headers="historyHeaders"
              :items="serviceHistory"
              class="elevation-1"
              item-value="id"
            >
              <template v-slot:body="{ items }">
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.service_name }}</td>
                  <td>
                    <template v-if="item.status === 'Assigned'">
                      <v-btn small color="success" @click="closeService(item.id)">
                        Close
                      </v-btn>
                    </template>
                    <template v-else>
                      {{ item.status }}
                    </template>
                  </td>
                  <td>{{ item.date_of_request }}</td>
                  <td>{{ item.remarks }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    `,
    data() {
      return {
        // Carousel data
        availableServices: [],
  
        // Table headers
        historyHeaders: [
          { text: "Request ID", value: "id" },
          { text: "Service Name", value: "service_name" },
          { text: "Status", value: "status" },
          { text: "Date of Request", value: "date_of_request" },
          { text: "Remarks", value: "remarks" },
        ],
  
        // Table data
        serviceHistory: [],
      };
    },
    methods: {
      async fetchDashboardData() {
        try {
          const response = await fetch("/api/customer-dashboard");
          const data = await response.json();
          if (response.ok) {
            this.availableServices = data.available_services;
            this.serviceHistory = data.service_history;
          } else {
            alert("Failed to fetch dashboard data.");
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      },
      closeService(serviceId) {
        // Logic to close the service
        console.log(`Closing service: ${serviceId}`);
        // Add your API call logic here
      },
    },
    created() {
      this.fetchDashboardData();
    },
  });
  