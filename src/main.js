import Vue from 'vue'
import App from './App.vue'
import "amfe-flexible"
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
