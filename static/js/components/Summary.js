const SummaryChart={
  data() {
    return {
      serviceRequestCounts: [],
      ratingCounts: [],
    };
  },
  methods: {
    async fetchSummaryData() {
      try {
        const response = await fetch('/api/stats-api');
        const data = await response.json();
         
        this.serviceRequestCounts = [
            data.service_request_counts?.requested || 0,
            data.service_request_counts?.rejected || 0,
            data.service_request_counts?.assigned || 0,
            data.service_request_counts?.closed || 0,
          ];
        this.ratingCounts = data.rating_counts || [0, 0, 0, 0, 0];
  console.log(this.serviceRequestCounts);
  
        // Call methods to render charts
        this.renderCharts();
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    },

    renderCharts() {
        // Render Bar Chart for Service Request Status if canvas exists
        const serviceRequestCanvas = document.getElementById('serviceRequestsChart');
        if (!serviceRequestCanvas) {
            console.error('Service Request Chart canvas not found.');
            return;
          }
        
        if (serviceRequestCanvas) {
          new Chart(serviceRequestCanvas, {
            type: 'bar',
            data: {
              labels: ['Requested', 'Rejected', 'Assigned', 'Closed'],
              datasets: [
                {
                  label: 'Service Requests',
                  data: this.serviceRequestCounts,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      
        // Render Pie Chart for Rating Distribution if canvas exists
        const ratingCanvas = document.getElementById('ratingChart');
        if (ratingCanvas) {
          new Chart(ratingCanvas, {
            type: 'pie',
            data: {
              labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
              datasets: [
                {
                  data: this.ratingCounts,
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#FF9F40',
                  ],
                },
              ],
            },
          });
        }
      },
      
  },
  created() {
    this.fetchSummaryData();
  },
};

export default SummaryChart