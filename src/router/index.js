import Vue from 'vue'
import Router from 'vue-router'
import DragResize from '@/components/dragResize.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DragResize',
      component: DragResize
    }
  ]
})
