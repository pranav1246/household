import router from "./router.js"
import Navbar from "./components/Navbar.js"


new Vue({
  el:"#app",
  vuetify: new Vuetify(),
  template:
  `<v-app>
   <v-main>
  <v-container>
   <Navbar /> <router-view /> 
  </v-container>
</v-main>
  </v-app>`,
  router:router,
  components:{
    Navbar,
  },
 
})