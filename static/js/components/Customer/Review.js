export default Vue.component("review-service", {
    template: `
      <v-container>
        <v-row>
          <v-col>
            <h2>Leave a Review</h2>
            <v-form ref="reviewForm" v-model="isValid">
              <v-row>
                <v-col>
                  <h3>Rating</h3>
                  <v-rating
                  v-model="rating"
                  color="yellow"
                  background-color="grey"
                  dense
                  hover
                  length="5"
                  large
                  size="30"
                ></v-rating>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="comments"
                    label="Comments (optional)"
                    outlined
                    rows="4"
                    auto-grow
                    clearable
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    :disabled="!rating"
                    color="success"
                    @click="submitReview"
                  >
                    Submit Review
                  </v-btn>
                  <v-btn color="error" @click="$emit('cancel')">
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    `,
    data() {
      return {
        rating: 0, // Default rating is 0
        comments: "", // Optional comments
        isValid: false, // Form validation state
      };
    },
    props: {
      serviceRequestId: {
        type: Number,
        required: true, // The service request ID is required
      },
    },
    methods: {
      async submitReview() {
        try {
          const response = await fetch("/api/add-review", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization-Token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              service_request_id: this.serviceRequestId,
              rating: this.rating,
              comments: this.comments,
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert(data.message); // Show success message
            this.$emit("review-submitted"); // Notify parent to refresh dashboard
          } else {
            alert(data.message || "Failed to submit review.");
          }
        } catch (error) {
          console.error("Error submitting review:", error);
        }
      },
    },
  });
  