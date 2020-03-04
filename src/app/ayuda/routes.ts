import { RouteConfig } from 'vue-router/types/router';

export const AyudaRoutes: RouteConfig[] = [
  {
    path: '/ayuda',
    name: 'ayuda',
    component: () => import(/* webpackChunkName: "ayuda" */ './Ayuda/Ayuda.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
