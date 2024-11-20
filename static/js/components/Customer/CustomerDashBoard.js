export default Vue.component("customer-dashboard", {
  template: `
  <v-container>
  
  <v-row v-if="!showReviewForm">
    <v-col>
      <h2>Looking for?</h2>
      <v-carousel
        v-if="!showServiceTable"
        height="400"
        show-arrows="hover"
        cycle
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(service, index) in availableServices"
          :key="index"
          @click="selectCategory(service.name)"
        >
          <v-sheet color="primary" height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <div class="text-h2">
                {{ service.name }}
              </div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>

      <book-service
        v-if="showServiceTable"
        :selected-category="selectedCategory"
        :services="searchResults"
        @service-booked="refreshServiceHistory"
        @go-back="showServiceTable = false"
      ></book-service>
    </v-col>
  </v-row>

  <v-row v-if="!showReviewForm">
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
            <td>{{ item.date_of_request }}</td>
            <td>{{ item.remarks }}</td>
            <td>
              <template v-if="item.status === 'assigned'">
                <v-btn small color="success" @click="closeService(item.id)">
                  Close It?
                </v-btn>
              </template>
              <template v-else-if="item.status === 'closed' && !item.has_review">
                <v-btn small color="info" @click="showReviewFormComponent(item.id)">
                  Add Review
                </v-btn>
              </template>
              <template v-else>
                {{ item.status }}
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <review-service
    v-if="showReviewForm"
    :service-request-id="currentServiceRequestId"
    @review-submitted="handleReviewSubmitted"
    @cancel="cancelReview"
  ></review-service>
</v-container>
`,
  data() {
    return {
      availableServices: [],
      historyHeaders: [
        { text: "Request ID", value: "id" },
        { text: "Service Name", value: "service_name" },
        { text: "Date of Request", value: "date_of_request" },
        { text: "Remarks", value: "remarks" },
        { text: "Status", value: "status",sortable: false  },
      ],

      serviceHistory: [],
      showServiceTable: false,
      selectedCategory: "",
      searchResults: [],
      showReviewForm: false,
      currentServiceRequestId: null,
      
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await fetch("/api/customer-dashboard", {
          method: "GET",
          headers: { "Authorization-Token": localStorage.getItem("token") },
        });
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
    async selectCategory(category) {
      this.selectedCategory = category;
      this.showServiceTable = true;
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(category)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch services for the category.");
        }
        const data = await response.json();
        this.searchResults = data.services || [];
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    async refreshServiceHistory() {
      try {
        const response = await fetch("/api/customer-dashboard");
        const data = await response.json();
        if (response.ok) {
          this.serviceHistory = data.service_history;
        } else {
          console.error("Failed to refresh service history");
        }
      } catch (error) {
        console.error("Error refreshing service history:", error);
      }
    },
    async closeService(requestId) {
      try {
        const response = await fetch(`/api/close-service/${requestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization-Token": localStorage.getItem("token"), 
          },
          body: JSON.stringify({ action: "close" }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message); 
          this.fetchDashboardData(); 
        } else {
          alert(data.message || "Failed to close the service request.");
        }
      } catch (error) {
        console.error("Error closing service request:", error);
      }
    },
    showReviewFormComponent(requestId) {
      this.currentServiceRequestId = requestId;
      this.showReviewForm = true;
    },
    handleReviewSubmitted() {
      this.showReviewForm = false;
      this.fetchDashboardData(); // Refresh data
    },
    cancelReview() {
      this.showReviewForm = false;
    },

  },
  created() {
    this.fetchDashboardData();
  },
});
