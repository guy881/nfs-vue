import Vue from 'vue'
import Router from 'vue-router'
import Scanning from '@/views/Scanning'
import Hardware from '@/views/Hardware'
import Analyzer from '@/views/Analyzer'
import Probe from '@/views/Probe'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Scanning
    },
    {
      path: '/scans/',
      name: 'scans',
      component: Scanning
    },
    {
      path: '/hardware/',
      name: 'hardware',
      component: Hardware
    },
    {
      path: '/analyzers/:id?/',
      name: 'analyzer',
      component: Analyzer
    },
    {
      path: '/probes/:id?/',
      name: 'probe',
      component: Probe
    },
    {
      path: '/import/',
      name: 'import',
      component: Scanning
    },
    {
      path: '/settings/',
      name: 'settings',
      component: Scanning
    }
  ],
  linkExactActiveClass: 'active'
})
