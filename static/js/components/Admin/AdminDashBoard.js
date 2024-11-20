export default Vue.component("admin-dashboard", {
    template: `
      <v-container>
         <v-btn color="danger" @click="downloadReport">Download Report</v-btn>
        <edit-service-form
        v-if="editingService || addingService"
        :service="editingService || newService"
        @service-saved="refreshServices"
        @cancel="cancelEdit"
      ></edit-service-form>

        <!-- Services Table -->
        <div v-else>
        <v-card class="mt-4">
          <v-card-title>
            <h2>Services</h2>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="addService">Add New Service</v-btn>
          </v-card-title>

          <v-data-table
            :headers="serviceHeaders"
            :items="services"
            item-value="id"
            class="elevation-1"
            dense
          >
           <template v-slot:item.action="{ item }" @click="showService(item.id)">

              <v-btn small color="blue" @click="editService(item.id)"><v-icon>mdi-pencil</v-icon></v-btn>
             
              <v-btn small color="red" @click="deleteService(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
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
           
           <v-btn 
           small 
           color="green" 
           :disabled="item.is_active" 
           @click="toggleStatus(item.id, true)"
         >
           Approve
         </v-btn>
         <v-btn 
           small 
           color="orange" 
           :disabled="!item.is_active" 
           @click="toggleStatus(item.id, false)"
         >
           Reject
         </v-btn>
              <v-btn small color="red" @click="deleteProfessional(item.id)">Delete</v-btn>
              <v-btn small color="blue" @click="viewDocument(item.attached_docs_path)" > View  </v-btn>
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
          >
          <template v-slot:item.action="{ item }">
          <v-btn 
           small 
           color="red" 
           :disabled="!item.active"
           @click="toggleStatus(item.id, false)"
         >
           Block
         </v-btn>
          </template>
          </v-data-table>
        </v-card>
        </div>
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
          { text: "Action", value: "action", sortable: false },
        ],
        editingService: null,
        addingService: false,
        newService: {
        name: "",
        description: "",
        base_price: 0,
        time_required: 0,
      },
      };

    },
    methods: {
      async fetchDashboardData() {
        try {
          const response = await fetch("/api/admin-dashboard", {
            method: "GET",
            headers: { "authentication-token": localStorage.getItem("token") },
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
      addService() {
        this.addingService = true; 
      },
      async editService(serviceId) {
        try {
          const response = await fetch(`/api/service/${serviceId}`);
          const fullServiceDetails = await response.json();
          
          if (response.ok) {
            this.editingService = fullServiceDetails;
           
            
          } else {
            alert(fullServiceDetails.message || "Failed to fetch service details.");
          }
        } catch (error) {
          console.error("Error fetching service details:", error);
          alert("An error occurred.");
        }
      },
      cancelEdit() {
        this.editingService = null; 
        this.addingService = false;
        this.fetchDashboardData()
      },
      refreshServices() {
        this.cancelEdit();
        this.fetchDashboardData();
      },
      deleteService(serviceId) {
        if (confirm("Are you sure you want to delete this service?")) {
          fetch(`/api/service/${serviceId}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success) {
                this.services = this.services.filter(
                  (service) => service.id !== serviceId
                );
                alert("Service deleted successfully.");
              } else {
                alert(result.message || "Failed to delete service.");
              }
            })
            .catch((error) => {
              console.error("Error deleting service:", error);
              alert("An error occurred.");
            });
        }
      },
      async viewDocument(filePath) {
        fetch(`${filePath}`) 
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob(); 
        })
        .then(blob => {
          const fileUrl = URL.createObjectURL(blob); 
          window.open(fileUrl, '_blank'); 
        })
        .catch(error => {
          console.error('Error fetching the file:', error);
        });
      },
      async toggleStatus(userId, approve) {
        try {
          const response = await fetch("/api/change-status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "authentication-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ user_id: userId }),
          });
    
          const result = await response.json();
          if (response.ok) {
          
            const user = this.professionals.find((p) => p.id === userId);
            if (user) {
              user.is_active = approve; 
            }
            alert("Status changed")
      
          } else {
            alert(result.message || "Failed to toggle status.");
          }
        } catch (error) {
          console.error("Error toggling status:", error);
          alert("An error occurred.");
        }
      },
      async deleteProfessional(profid){
        if (confirm("Are you sure you want to delete?")) {
          fetch(`/api/delete-professional/${profid}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success) {
                this.professionals = this.professionals.filter(
                  (prof) => prof.id !== profid
                );
                alert(" deleted successfully.");
                this.fetchDashboardData();
              } else {
                alert(result.message || "Failed to delete");
              }
            })
            .catch((error) => {
              console.error("Error deleting :", error);
              alert("An error occurred.");
            });
        }

      },
      async downloadReport(){
        fetch('/download-csv')
        .then((response)=>response.json())
        .then((result)=>{
           if(result.success){
            task_id=result.task_id
           }
        }).catch((error) => {
          console.error("Error deleting :", error);
          alert("An error occurred.");
        });

        fetch(`get-csv/${task_id}`)
        .then((response)=>response.json())
        .then((result)=>{
          if(result.success){
            const blob=result.blob()
            const fileUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = "result.csv"; 
            document.body.appendChild(link);
            link.click(); 
            document.body.removeChild(link); 
            window.URL.revokeObjectURL(fileUrl); 
          }
        }).catch((error) => {
          console.error("Error deleting :", error);
          alert("An error occurred.");
        });

      }
    },
    components: {
      EditServiceForm: () => import("./EditService.js"),
    },
    created() {
      this.fetchDashboardData();
    },
  });
