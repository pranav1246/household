export default Vue.component("book-service", {
  template: `
    <v-container>
      <v-btn text @click="$emit('go-back')">Go Back</v-btn>
      <v-row>
        <v-col cols="12">
          <h2>Available Services - {{ selectedCategory }}</h2>
          <v-data-table
            :headers="serviceHeaders"
            :items="services"
            class="elevation-1"
            dense
          >
            <template v-slot:item.action="{ item }">
              <v-btn small color="success" @click="openBookingDialog(item)">
                Book
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <!-- Booking Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>Book Service</v-card-title>
          <v-card-text>
            <p>Service: {{ selectedService?.name }}</p>
            <v-textarea
              v-model="remarks"
              label="Remarks (optional)"
              outlined
              dense
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="confirmBooking">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  `,
  props: {
    selectedCategory: String,
    services: Array,
  },
  data() {
    return {
      dialog: false,
      selectedService: null,
      remarks: "",
      serviceHeaders: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Base Price", value: "base_price" },
        { text: "Action", value: "action", sortable: false },
      ],
    };
  },
  methods: {
    openBookingDialog(service) {
      this.selectedService = service;
      this.dialog = true;
    },
    async confirmBooking() {
      try {
        const payload = {
          service_id: this.selectedService.id,
          remarks: this.remarks,
        };
        console.log("Payload:", payload);
        const response = await fetch("/api/service-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" ,"Authorization-Token":localStorage.getItem("token")},
          body: JSON.stringify({
            service_id: this.selectedService.id,
            remarks: this.remarks,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          this.$emit("service-booked", data); // Notify parent
          this.dialog = false;
          this.selectedService = null;
          this.remarks = "";
        } else {
          console.error("Booking failed:", data.message);
        }
      } catch (error) {
        console.error("Error booking service:", error);
      }
    },
  },
});
