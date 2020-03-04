import { RouteConfig } from 'vue-router/types/router';

export const PerfilRoutes: RouteConfig[] = [
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import(/* webpackChunkName: "perfil" */ './Perfil/Perfil.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
