import Vue from 'vue';
import VueRouter, { Route, RouteRecord } from 'vue-router';
import Meta from 'vue-meta';
import { AppRoutes } from './app/routes';
import { HomeRoutes } from './home/routes';
import { DashboardRoutes } from './example/dashboard/routes';
import { store } from '@/app/store';
import { AyudaRoutes } from './ayuda/routes';
import { PerfilRoutes } from './perfil/routes';

import { CounterRoutes } from './example/counter/routes';
import { FormRoutes } from './example/form/routes';
import { FincaRoutes } from './finca/routes';
import { AlertaRoutes } from './alerta/routes';
import { AltaFincaRoutes } from './altaFinca/routes';
import { AltaAlertaRoutes } from './altaAlerta/routes';
import { DetalleFincaRoutes } from './detalleFinca/routes';
import { DetallePivotRoutes } from './detallePivot/routes';
import { AltaPivotRoutes } from './altaPivot/routes';
import { DetalleDispositivoRoutes } from './detalleDispositivo/routes';
import { AltaDispositivoRoutes } from './altaDispositivo/routes';
import { HistoricoAlertaRoutes } from './historicoAlerta/routes';
import { RegistrarUsuarioRoutes } from './registrarUsuario/routes';
import firebase from 'firebase';

Vue.use(VueRouter);
Vue.use(Meta);

import {Database} from './interfaceDatabase';
import {ImplementationDatabase} from './firebaseImplementation';
<<<<<<< HEAD
import { DetalleAlertaRoutes } from './detalleAlerta/routes';
=======
>>>>>>> origin/master

let FunctionsDatabase: Database = new ImplementationDatabase();
FunctionsDatabase.init();

export const router: VueRouter = new VueRouter({
  mode: 'history',
  base: __dirname,
<<<<<<< HEAD
  routes: [...AppRoutes, ...HomeRoutes, ...DashboardRoutes, ...AyudaRoutes, ...PerfilRoutes, ...CounterRoutes, ...FormRoutes, ...FincaRoutes, ...AlertaRoutes, ...AltaFincaRoutes, ...AltaAlertaRoutes, ...DetalleFincaRoutes, ...DetallePivotRoutes, ...AltaPivotRoutes, ...DetalleDispositivoRoutes, ...AltaDispositivoRoutes, ...HistoricoAlertaRoutes, ...RegistrarUsuarioRoutes, ...DetalleAlertaRoutes],
=======
  routes: [...AppRoutes, ...HomeRoutes, ...DashboardRoutes, ...AyudaRoutes, ...PerfilRoutes, ...CounterRoutes, ...FormRoutes, ...FincaRoutes, ...AlertaRoutes, ...AltaFincaRoutes, ...AltaAlertaRoutes, ...DetalleFincaRoutes, ...DetallePivotRoutes, ...AltaPivotRoutes, ...DetalleDispositivoRoutes, ...AltaDispositivoRoutes, ...HistoricoAlertaRoutes, ...RegistrarUsuarioRoutes],
>>>>>>> origin/master
  scrollBehavior(to: Route, from: Route, savedPosition: { x: number; y: number }) {
    if (to.hash) {
      return { selector: to.hash };
    }
    return savedPosition || { x: 0, y: 0 };
  },
});

// example guard
// TODO remove or adjust in production code
router.beforeEach((to: Route, from: Route, next: any) => {

  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const user = firebase.auth().currentUser;
  const autorizacion = to.matched.some((record: RouteRecord) => record.meta.requiresAuth);
<<<<<<< HEAD

  //FunctionsDatabase.userAutenticated().then((result) =>{
=======
   firebase.auth().onAuthStateChanged(function(user) {
      //  console.log(user);
       })  
>>>>>>> origin/master

  if (autorizacion && !isAuthenticated) {
     next({ path: '/', query: { redirect: to.fullPath } });
  }
    else if (!autorizacion && isAuthenticated) {
      next({ path: '/example/dashboard', query: { redirect: to.fullPath } });
    }
   else {
    next();
   }
<<<<<<< HEAD
//});

=======
>>>>>>> origin/master
});





/*router.beforeEach((to: Route, from: Route, next: any) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const user = firebase.auth().currentUser;
  console.log(isAuthenticated);console.log(isAuthenticated);console.log(isAuthenticated);
  console.log(user);
  if (to.matched.some((record: RouteRecord) => record.meta.requiresAuth)) {
    const isAuthenticated = store.getters['auth/isAuthenticated'];

    if (!isAuthenticated) {
      next({ path: '/', query: { redirect: to.fullPath } });
    } else{
       //FALLO RELOAD
	next();
    }
  } else {
    next();
  }
});*/


