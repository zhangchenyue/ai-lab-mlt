import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Data from '@/views/Data'
import Analysis from '@/views/Analysis'
import Model from '@/views/Model'
import Blog from '@/views/Blog'
import Documents from '@/views/Documents'
import Tutorial from '@/views/Tutorial'
import HelpCenter from '@/views/HelpCenter'
import Log from '@/views/Log'
import Landing from '@/views/Landing'
import Account from '@/views/Account'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Landing', component: Landing, meta: { auth: false } },
    { path: '/home', name: 'Home', component: Home, meta: { auth: false } },
    { path: '/login', name: 'Login', component: Login, meta: { auth: false } },
    { path: '/helloworld', name: 'HelloWorld', component: HelloWorld, meta: { auth: false } },
    { path: '/data', name: 'data', component: Data, meta: { auth: true } },
    { path: '/analysis', name: 'analysis', component: Analysis, meta: { auth: true } },
    { path: '/model', name: 'model', component: Model, meta: { auth: true } },
    { path: '/blog', name: 'blog', component: Blog, meta: { auth: true } },
    { path: '/documents', name: 'documents', component: Documents, meta: { auth: true } },
    { path: '/tutorial', name: 'tutorial', component: Tutorial, meta: { auth: false } },
    { path: '/helpcenter', name: 'HelpCenter', component: HelpCenter, meta: { auth: true } },
    { path: '/log', name: 'Log', component: Log, meta: { auth: true } },
    { path: '/account', name: 'Account', component: Account, meta: { auth: true } }
  ]
})
