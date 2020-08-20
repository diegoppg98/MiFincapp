import { RouteConfig } from 'vue-router/types/router';

export const DashboardRoutes: RouteConfig[] = [
  {
    path: '/inicio',
    name: 'inicio',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ './Dashboard/Dashboard.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
