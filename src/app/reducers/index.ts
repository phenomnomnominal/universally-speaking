import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';


import { environment } from '../../environments/environment';

export interface State {
  [key: string]: any;
}

export interface AsyncItem<T> {
  isLoading: boolean;
  error?: Error;
  cachedAt?: Date;
  item?: T;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
