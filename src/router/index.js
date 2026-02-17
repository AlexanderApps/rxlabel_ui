import { createRouter, createWebHashHistory } from 'vue-router'

import MedicationLabel from '../renderer/src/pages/MedicationLabel.vue'
import MedicationLabelQueue from '../renderer/src/pages/MedicationLabelQueue.vue'
import Settings from '../renderer/src/pages/Settings.vue'
import LoginPage from '../renderer/src/pages/LoginPage.vue'
import ClientListView from '../renderer/src/pages/ClientListView.vue'
import UserListView from '../renderer/src/pages/UserListView.vue'
import ClientPage from '../renderer/src/pages/ClientPage.vue'
import Setup from '../renderer/src/pages/Setup.vue'
import AdminPage from '../renderer/src/pages/AdminPage.vue'
import TestLabelJson from '../renderer/src/pages/TestLabelJson.vue'

const routes = [
  {
    path: '/',
    name: 'MedicationLabel',
    component: MedicationLabel,
    meta: { requiresAuth: true }
  },
  {
    path: '/test-label-json',
    name: 'TestLabelJson',
    component: TestLabelJson,
    meta: { requiresAuth: true }
  },
  {
    path: '/queue',
    name: 'MedicationLabelQueue',
    component: MedicationLabelQueue,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
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
    path: '/users',
    name: 'Users',
    component: UserListView,
    meta: { requiresAuth: true, roles: ['admin', 'manager'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/clients/:id',
    name: 'Client',
    component: ClientPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'Client',
    component: ClientPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup
  }
]

const router = createRouter({
  history: createWebHashHistory(), // IMPORTANT for Electron
  routes
})

// router.beforeEach(async (to, from, next) => {
//   // 1. Check if the system is already set up
//   // Replace 'window.api.isSetupComplete()' with your actual Electron API check
//   const isSetupComplete = await window.api.isSetupComplete()

//   // 2. Redirect to Setup if not complete (and not already going to Setup)
//   if (!isSetupComplete && to.name !== 'Setup') {
//     return next({ name: 'Setup' })
//   }

//   // 3. If setup is complete but user tries to go back to Setup, redirect Home
//   if (isSetupComplete && to.name === 'Setup') {
//     return next({ name: 'MedicationLabel' })
//   }

//   // 4. Continue with your existing Auth Logic
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
//   const me = await window.api.getMe()
//   const isAuthenticated = me !== null && me !== undefined

//   if (requiresAuth && !isAuthenticated) {
//     return next('/login')
//   }

//   next()
// })

router.beforeEach(async (to, from, next) => {
  // 1. Setup check (from previous step)
  const isSetupComplete = await window.api.isSetupComplete()
  if (!isSetupComplete && to.name !== 'Setup') {
    return next({ name: 'Setup' })
  }

  // 2. Authentication check
  const me = await window.api.getMe()
  const isAuthenticated = me !== null && me !== undefined

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // 3. Role-based Authorization check
  if (to.meta.roles) {
    const userRole = me?.role
    const hasPermission = to.meta.roles.includes(userRole)

    if (!hasPermission) {
      // Redirect to home or a "Forbidden" page if they lack the role
      return next({ name: 'MedicationLabel' })
    }
  }

  next()
})

export default router
