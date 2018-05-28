export default {
    install(Vue, options) {
        Vue.prototype.$bus = new Vue();
        Vue.prototype.$bus.on = Vue.prototype.$bus.$on;
        Vue.prototype.$bus.emit = Vue.prototype.$bus.$emit;
        Vue.prototype.$bus.E_LAST_ERROR = 'E_LAST_ERROR';
        Vue.prototype.$bus.E_CURRENT_SOURCE = 'E_CURRENT_SOURCE';
        Vue.prototype.$bus.E_WINDOW_RESIZE = 'E_WINDOW_RESIZE';
        Vue.prototype.$bus.E_PATTERN_CHANGE = 'E_PATTERN_CHANGE';
        Vue.prototype.$bus.E_ERROR = 'E_ERROR';
    }
}
