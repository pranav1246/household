import router from "./router.js"
import store from "./store.js"
import Home from "./components/Home.js"

new Vue({
  el:"#app",
  vuetify: new Vuetify({icons:{iconfont:'md'},}),
  store,
  render: (h) => h(Home),
  router:router,
})