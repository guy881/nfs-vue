import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: 'scans/',
      name: 'scans',
      component: Home
    },
    {
      path: 'hardware/',
      name: 'hardware',
      component: Home
    },
    {
      path: 'import/',
      name: 'import',
      component: Home
    },
    {
      path: 'settings/',
      name: 'settings',
      component: Home
    }
  ],
  linkExactActiveClass: 'active'
})
