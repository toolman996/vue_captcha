// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// axios配置
import axios from "axios";

Vue.prototype.$axios = axios;

//element-ui
import Element from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element);

//自定义配置生效
import settings from "./settings";

Vue.prototype.$settings = settings;

//导入极验验证码
import '../static/js/gt.js'

import '../static/css/global.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
