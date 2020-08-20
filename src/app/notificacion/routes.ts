import { RouteConfig } from 'vue-router/types/router';

export const NotificacionRoutes: RouteConfig[] = [
  {
    path: '/notificacion',
    name: 'notificacion',
    component: () => import(/* webpackChunkName: "notificacion" */ './Notificacion/Notificacion.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: true,
    },
  },
];
