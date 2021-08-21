import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/all.scss";
import "bootstrap";

// import '@/assets/css/global.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus,{size:'mini'})
app.component('Loading',Loading)
app.mount('#app')
