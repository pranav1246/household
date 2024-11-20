export default {
    template: `
    <v-app>
      <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Search"
              v-model="searchQuery"
              @keyup.enter="performSearch"
              outlined
              dense
            ></v-text-field>
            <v-btn color="primary" @click="performSearch">Search</v-btn>
          </v-col>
        </v-row>
  
        <template v-if="!hasResults">
          <v-row>
            <v-col cols="12">
              <p>No results to display. Enter a search query above.</p>
            </v-col>
          </v-row>
        </template>
  
        <template v-else>
          <!-- Services Table -->
          <v-row v-if="results.services.length > 0">
            <v-col cols="12">
              <h2>Services</h2>
              <v-data-table
                :headers="serviceHeaders"
                :items="results.services"
                class="elevation-1"
                dense
              >
                <template v-slot:item.action="{ item }">
                  <v-btn small color="success" @click="bookService(item.id)">
                    Book
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
  
          <!-- Professionals Table -->
          <v-row v-if="results.professionals.length > 0">
            <v-col cols="12">
              <h2>Professionals</h2>
              <v-data-table
                :headers="professionalHeaders"
                :items="results.professionals"
                class="elevation-1"
                dense
              ></v-data-table>
            </v-col>
          </v-row>
  
          <!-- Customers Table -->
          <v-row v-if="results.customers.length > 0">
            <v-col cols="12">
              <h2>Customers</h2>
              <v-data-table
                :headers="customerHeaders"
                :items="results.customers"
                class="elevation-1"
                dense
              ></v-data-table>
            </v-col>
          </v-row>
  
          <!-- Service Requests Table -->
          <v-row v-if="results.service_requests.length > 0">
            <v-col cols="12">
              <h2>Service Requests</h2>
              <v-data-table
                :headers="serviceRequestHeaders"
                :items="results.service_requests"
                class="elevation-1"
                dense
              ></v-data-table>
            </v-col>
          </v-row>
        </template>
      </v-container>
      </v-main>
      </v-app>
    `,
  
    data() {
      return {
        searchQuery: "",
        results: {
          services: [],
          professionals: [],
          customers: [],
          service_requests: [],
        },
      };
    },
  
    computed: {
      hasResults() {
        return (
          this.results.services.length > 0 ||
          this.results.professionals.length > 0 ||
          this.results.customers.length > 0 ||
          this.results.service_requests.length > 0
        );
      },
      serviceHeaders() {
        return [
          { text: "ID", value: "id" },
          { text: "Name", value: "name" },
          { text: "Description", value: "description" },
          { text: "Base Price", value: "base_price" },
          { text: "Action", value: "action", sortable: false },
        ];
      },
      professionalHeaders() {
        return [
          { text: "ID", value: "id" },
          { text: "Name", value: "name" },
          { text: "Service Type", value: "service" },
        ];
      },
      customerHeaders() {
        return [
          { text: "ID", value: "id" },
          { text: "Customer Name", value: "customer_name" },
          { text: "Status", value: "status" },
        ];
      },
      serviceRequestHeaders() {
        return [
          { text: "ID", value: "id" },
          { text: "Service Name", value: "service_name" },
          { text: "Status", value: "status" },
          { text: "Address", value: "customer_address" },
          { text: "Pincode", value: "customer_pincode" },
          { text: "Date of Request", value: "date_of_request" },
        ];
      },
    },
  
    methods: {
      async performSearch() {
        if (!this.searchQuery.trim()) {
          alert("Please enter a search query.");
          return;
        }
  
        try {
          const response = await fetch(`/api/search?query=${encodeURIComponent(this.searchQuery)}`);
          if (!response.ok) {
            throw new Error("Failed to fetch search results.");
          }
          const data = await response.json();
          this.results = data;
        } catch (error) {
          console.error("Error during search:", error);
        }
      },
      bookService(serviceId) {
        console.log(`Booking service with ID: ${serviceId}`);
        // Logic to book the service
      },
    },
  };
  