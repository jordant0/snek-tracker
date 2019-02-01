import Vue from 'nativescript-vue'
import Login from './components/Login'
import VueDevtools from 'nativescript-vue-devtools'
import store from './store/index'
import * as ApplicationSettings from "application-settings"
import Vuex from 'vuex'
import RadListView from 'nativescript-ui-listview/vue';

import './app.scss'

Vue.use(Vuex)

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '192.168.1.116' })
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadListView);
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

var firebase = require("nativescript-plugin-firebase");
firebase
.init({})
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

  created() {
    this.$store.commit('load');
  },

  mounted() {
    this.$store.subscribe((mutations, state) => {
      ApplicationSettings.setString("store", JSON.stringify(state));
    });
  },

  render: h => h('frame', [h(Login)])
}).$start()
