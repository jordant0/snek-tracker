import Vue from 'nativescript-vue'
import Login from './components/Login'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store/index'
import * as ApplicationSettings from "application-settings"
import Vuex from 'vuex'
import RadListView from 'nativescript-ui-listview/vue'
import firebase from "nativescript-plugin-firebase"
import BackendService from './services/BackendService'
import AuthService from './services/AuthService'
import DataService from './services/DataService'

import './app.scss'

Vue.use(Vuex)

export const backendService = new BackendService()
export const authService = new AuthService()
export const dataService = new DataService()

Vue.prototype.$authService = authService
Vue.prototype.$backendService = backendService
Vue.prototype.$database = dataService

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '192.168.1.116' })
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadListView);
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

firebase
.init({
  onAuthStateChanged: data => {
    console.log((data.loggedIn ? "Logged in to firebase" : "Logged out from firebase") + " (firebase.init() onAuthStateChanged callback)");
    if (data.loggedIn) {
      backendService.token = data.user.uid
      console.log("uID: " + data.user.uid)
      store.commit('setIsLoggedIn', true)
    }
    else {
      store.commit('setIsLoggedIn', false)
    }
  }
})
.then(
  function(instance) {
    console.log("firebase.init done");
  },
  function(error) {
    console.log("firebase.init error: " + error);
  }
);

Vue.prototype.$firebase = firebase;

new Vue({
  store,

  // created() {
  //   this.$store.commit('load');
  // },
  //
  // mounted() {
  //   this.$store.subscribe((mutations, state) => {
  //     ApplicationSettings.setString("store", JSON.stringify(state));
  //   });
  // },

  render: h => h('frame', [h(Login)])
}).$start()
