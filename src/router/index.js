import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      children:[
        {
          path: '',
          name: 'mageuser',
          component: () => import('../views/admin/MageUser.vue'),
        },
        {
          path: 'magediss',
          name: 'magediss',
          component: () => import('../views/admin/MageDiss.vue'),
        },
        {
          path:'megdiscussion',
          name:'megdiscussion',
          component: () => import('../views/DiscussionBoard.vue'),
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
      children:[
        {
          path:'',
          name:'schedule',
          component: () => import('../views/user/ScheDule.vue'),
        },
        {
          path:'learntask',
          name:'learntask',
          component: () => import('../views/user/LearnTask.vue'),
        },
        {
          path:'focus',
          name:'focus',
          component: () => import('../views/user/FoCus.vue'),
        },
        {
          path:'chatai',
          name:'chatai',
          component: () => import('../views/user/ChatAI.vue'),
        },
        {
          path:'discussion',
          name:'discussion',
          component: () => import('../views/DiscussionBoard.vue'),
        },
        {
          path:'datapre',
          name:'datapre',
          component: () => import('../views/user/DataPre.vue'),
        },
        {
          path:'myinfo',
          name:'myinfo',
          component: () => import('../views/user/MyInfo.vue'),
        }
      ]
    }
  ],
})

export default router
