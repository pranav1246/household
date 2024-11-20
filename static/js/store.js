const store = new Vuex.Store({
    state: {
      userRole: localStorage.getItem('role') || null, 
      token: localStorage.getItem('token') || null, 
      user_id:localStorage.getItem('user_id') || null,
    },
    mutations: {
      setUserRole(state, role) {
        state.userRole = role;
        localStorage.setItem('role', role);
      },
      clearUserRole(state) {
        state.userRole = null;
        localStorage.removeItem('role');
      },
      setToken(state, token) {
        state.token = token;
        localStorage.setItem('token', token);
      },
      clearToken(state) {
        state.token = null;
        localStorage.removeItem('token');
      },
      setUserID(state,user_id){
         state.user_id=user_id;
         localStorage.setItem('user_id',user_id);
      },
      clearUserID(state){
        state.user_id = null;
        localStorage.removeItem('user_id');
      },
    },
    actions: {
      login({ commit }, { role, token ,user_id}) {
      
        commit('setUserRole', role);
        commit('setToken', token);
        commit('setUserID',user_id);
      },
      logout({ commit }) {
       
        commit('clearUserRole');
        commit('clearToken');
        commit('clearUserID')
      },
    },
  });
  
  export default store;
  