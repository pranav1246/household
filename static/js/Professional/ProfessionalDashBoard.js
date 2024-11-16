export default Vue.component("professional-dashboard", {
    template: `
      <v-container>
        <v-row>
          <v-col>
            <h1>Professional Dashboard</h1>
          </v-col>
        </v-row>
  
        <!-- Pending Service Requests Table -->
        <v-row>
          <v-col>
            <h2>Pending Service Requests</h2>
            <v-data-table
              :headers="pendingHeaders"
              :items="pendingRequests"
              class="elevation-1"
              item-value="id"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Pending Service Requests</v-toolbar-title>
                </v-toolbar>
              </template>
  
              <template v-slot:body="{ items }">
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.request_id }}</td>
                  <td>{{ item.customer_name }}</td>
                  <td>{{ item.phone_number }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.pincode }}</td>
                  <td>{{ item.status }}</td>
                  <td>
                    <v-btn small color="success" @click="acceptRequest(item.request_id)">
                      Accept
                    </v-btn>
                    <v-btn small color="error" @click="rejectRequest(item.request_id)">
                      Reject
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
  
        <!-- Closed Service Requests Table -->
        <v-row>
          <v-col>
            <h2>Closed Service Requests</h2>
            <v-data-table
              :headers="closedHeaders"
              :items="closedRequests"
              class="elevation-1"
              item-value="id"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Closed Service Requests</v-toolbar-title>
                </v-toolbar>
              </template>
  
              <template v-slot:body="{ items }">
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.request_id }}</td>
                  <td>{{ item.customer_name }}</td>
                  <td>{{ item.phone_number }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.pincode }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.rating }}</td>
                  <td>{{ item.review }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    `,
    data() {
      return {
        // Table headers
        pendingHeaders: [
          { text: "Request ID", value: "request_id" },
          { text: "Customer Name", value: "customer_name" },
          { text: "Phone Number", value: "phone_number" },
          { text: "Address", value: "address" },
          { text: "Pincode", value: "pincode" },
          { text: "Status", value: "status" },
          { text: "Action", value: "action", sortable: false },
        ],
        closedHeaders: [
          { text: "Request ID", value: "request_id" },
          { text: "Customer Name", value: "customer_name" },
          { text: "Phone Number", value: "phone_number" },
          { text: "Address", value: "address" },
          { text: "Pincode", value: "pincode" },
          { text: "Status", value: "status" },
          { text: "Rating", value: "rating" },
          { text: "Review", value: "review" },
        ],
  
        // Data
        pendingRequests: [],
        closedRequests: [],
      };
    },
    methods: {
      async fetchRequests() {
        try {
          const response = await fetch("/api/professional-dashboard");
          const data = await response.json();
          console.log(data.pending_requests)
          if (response.ok) {
            this.pendingRequests = data.pending_requests;
            this.closedRequests = data.closed_requests;
          } else {
            alert("Failed to fetch requests.");
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      },
      acceptRequest(requestId) {
        // Logic for accepting a request
        console.log(`Accepting request: ${requestId}`,'skks');
      },
      rejectRequest(requestId) {
        // Logic for rejecting a request
        console.log(`Rejecting request: ${requestId}`,'sksk');
      },
    },
    created() {
      this.fetchRequests();
    },
  });
  