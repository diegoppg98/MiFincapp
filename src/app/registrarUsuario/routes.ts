import { RouteConfig } from 'vue-router/types/router';

export const RegistrarUsuarioRoutes: RouteConfig[] = [
  {
    path: '/registrar-usuario',
    name: 'registrarUsuario',
    component: () => 
      import(/* webpackChunkName: "registrar-usuario" */ './RegistrarUsuario/RegistrarUsuario.vue').then((m: any) => m.default),
    meta: {
      requiresAuth: false,
    },
  },
];
