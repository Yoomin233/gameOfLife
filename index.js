console.log('hi!')
Vue.component('sub-route', {
  template: '<div><p v-for="todo in todos">{{todo}}</p></div>',
  props:['todos']
})
window.app = new Vue({
  el: '#app',
  data: {
    todos: [1,2,3],
    html: '<span>234</span>',
    ifBtnDisabled: false,
  },
  mounted () {
    this.$watch('todos', (newVal, oldVal) => {
      console.log(newVal, oldVal, this)
    })
  }
})