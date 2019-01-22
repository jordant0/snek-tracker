import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import { store } from './store/index'
import * as ApplicationSettings from "application-settings";
import Vuex from 'vuex'

Vue.use(Vuex)

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: '192.168.1.116' })
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

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

  render: h => h('frame', [h(App)])
}).$start()
