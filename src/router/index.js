import { createRouter, createWebHashHistory } from 'vue-router'

import MedicationLabel from '../renderer/src/pages/MedicationLabel.vue'
import MedicationLabelQueue from '../renderer/src/pages/MedicationLabelQueue.vue'
import Settings from '../renderer/src/pages/Settings.vue'
import LoginPage from '../renderer/src/pages/LoginPage.vue'
import ClientListView from '../renderer/src/pages/ClientListView.vue'
import ClientPage from '../renderer/src/pages/ClientPage.vue'

const routes = [
  {
    path: '/',
    name: 'MedicationLabel',
    component: MedicationLabel
  },
  {
    path: '/queue',
    name: 'MedicationLabelQueue',
    component: MedicationLabelQueue
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/clients',
    name: 'Clients',
    component: ClientListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'Client',
    component: ClientPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // IMPORTANT for Electron
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  const me = await window.api.getMe()

  const isAuthenticated = me !== null && me !== undefined

  if (requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
