import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/main',
      name: 'main-page',
      component: require('@/components/MainPage').default
    },
    {
      path: '/',
      name: 'select-page',
      component: require('@/components/SelectPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
