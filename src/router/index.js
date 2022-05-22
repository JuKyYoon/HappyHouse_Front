import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QnaView from '../views/QnaView.vue'
import UserView from "../views/UserView.vue";
import MapView from "@/views/MapView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/qna',
    name: 'qna',
    component: QnaView,
    redirect: "/qna/list",
    children: [
      {
        path: 'list',
        name: "QnaList",
        component: () => import("@/components/qna/QnaList.vue")
      },
      {
        path: 'write',
        name: 'QnaEdit',
        component: () => import("@/components/qna/QnaEdit.vue")
      },
      {
        path: ':idx',
        name: 'QnaDetail',
        component: () => import("@/components/qna/QnaDetail.vue")
      },


    ]
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    children: [
      {
        path: 'login',
        name: 'UserLogin',
        component: () => import("@/components/user/UserLogin.vue")
      },
      {
        path: 'info',
        name: 'UserInfo',
        component: () => import("@/components/user/UserInfo.vue")

      }
    ]
  },
  {
    path: '/map',
    name: 'map',
    component: MapView,
    redirect: "map/main",
    children: [
      {
        path: 'main',
        name: 'main',
        component: () => import ("@/components/map/MainMap.vue")
      },
      {
        path: 'custom',
        name: 'custom',
        component: () => import ("@/components/map/CustomMap.vue")
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/callbacknaver',
    name: 'callbacknaver',
    component: () => import('@/components/callback/NaverRedirect.vue')
  },
  {
    path:'/socialsignup',
    name: 'socialsignup',
    component: () => import('@/views/SocialSignUpView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
