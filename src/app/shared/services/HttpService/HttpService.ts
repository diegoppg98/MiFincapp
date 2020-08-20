import VueRouter from 'vue-router';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Store } from 'vuex';
import { IState } from '@/app/state';
import { setupResponseInterceptor } from './setupResponseInterceptor';
import { setupRequestInterceptor } from './setupRequestInterceptor';

export interface IHttpService extends AxiosInstance {
  store?: Store<IState>;
  router?: VueRouter;
  isReAuthenticating?: boolean;
  pendingRequests?: any[];
}

export let HttpService: IHttpService = axios.create();

export const initHttpService = (store?: Store<IState>, router?: VueRouter) => {
  /* istanbul ignore next 
  
  headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }*/
  HttpService = axios.create({
    baseURL:
      (store &&
        store.state &&
        store.state.app &&
        store.state.app.config &&
        store.state.app.config.api &&
        store.state.app.config.api.baseUrl) ||
      '',
  });

  HttpService.store = store;
  HttpService.router = router;
  HttpService.isReAuthenticating = false;
  HttpService.pendingRequests = [];

  setupRequestInterceptor();
  setupResponseInterceptor();
};

export const replaceOldToken = (request: AxiosRequestConfig, accessToken: string): AxiosRequestConfig => {
  request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
};
