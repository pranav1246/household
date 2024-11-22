export default Vue.component("professional-dashboard", {
    template: `
      <v-container>
      <v-row>
      <v-col>
        <v-btn color="primary" @click="showAssignedRequests">View Assigned Requests</v-btn>
      </v-col>
    </v-row>
        <v-row>
          <v-col>
            <h2>Pending Service Requests</h2>
            <v-data-table
              :headers="pendingHeaders"
              :items="pendingRequests"
              class="elevation-1"
              item-value="id"
            >
            <template v-slot:item.action="{ item }">
                    <v-btn small color="success" @click="acceptRequest(item.request_id)">
                      Accept
                    </v-btn>
                    <v-btn small color="error" @click="rejectRequest(item.request_id)">
                      Reject
                    </v-btn>
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
              dense
            >
            <template v-slot:item.action="{ item }">
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="800px">
        <v-card>
          <v-card-title>Assigned Requests</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="assignedHeaders"
              :items="assignedRequests"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </v-container>
    `,
    data() {
      return {
        pendingHeaders: [
          { text: "Request ID", value: "request_id" },
          { text: "Customer Name", value: "customer_name" },
          { text: "Phone Number", value: "phone_number" },
          { text: "Address", value: "address" },
          { text: "Pincode", value: "pincode" },
          { text: "Status", value: "status" },
          {text:"Remarks",value:"remarks"},
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
        assignedHeaders: [
          { text: "Request ID", value: "request_id" },
          { text: "Customer Name", value: "customer_name" },
          { text: "Phone Number", value: "phone_number" },
          { text: "Address", value: "address" },
          { text: "Pincode", value: "pincode" },
          { text: "Remarks", value: "remarks" },
          { text: "Date of Request", value: "date_of_request" },
          { text: "Status", value: "status" },
        ],
  
       assignedRequests: [],
        pendingRequests: [],
        closedRequests: [],
        dialog: false,
      };
    },
    methods: {
      async fetchRequests() {
        try {
          const response = await fetch("/api/professional-dashboard", {
            method: "GET",
            headers: { "Authorization-Token": localStorage.getItem("token") },
          });
         
          const data = await response.json();
          console.log(data.pending_requests)
          if (response.ok) {
            this.pendingRequests = data.pending_requests;
            this.closedRequests = data.closed_requests;
            this.assignedRequests = data.assigned_requests;
          } else {
            alert("Failed to fetch requests.");
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      },
      async acceptRequest(requestId) {
        try {
          const response = await fetch(`/api/accept-reject-service/${requestId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization-Token": localStorage.getItem("token")

            },
            body: JSON.stringify({ action: "accept" }),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert(data.message);
            this.fetchRequests(); 
          } else {
            alert(data.message || "Failed to accept the request.");
          }
        } catch (error) {
          console.error("Error accepting request:", error);
        }
      },
      async rejectRequest(requestId) {
        try {
          const response = await fetch(`/api/accept-reject-service/${requestId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization-Token": localStorage.getItem("token")
            },
            body: JSON.stringify({ action: "reject" }),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert(data.message);
            this.fetchRequests(); 
          } else {
            alert(data.message || "Failed to reject the request.");
          }
        } catch (error) {
          console.error("Error rejecting request:", error);
        }
      },
      showAssignedRequests() {
        this.dialog = true;
      },
    },
    created() {
      this.fetchRequests();
    },
  });
  