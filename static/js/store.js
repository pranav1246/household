const store = new Vuex.Store({
    state: {
      userRole: localStorage.getItem('role') || null, 
      token: localStorage.getItem('token') || null, 
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
    },
    actions: {
      login({ commit }, { role, token }) {
      
        commit('setUserRole', role);
        commit('setToken', token);
      },
      logout({ commit }) {
       
        commit('clearUserRole');
        commit('clearToken');
      },
    },
  });
  
  export default store;
  