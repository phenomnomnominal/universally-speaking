import { Params } from '@angular/router';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { State } from './state';

export * from './async-item';
export * from './route-selectors';
export * from './state';

export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};

export const metaReducers: Array<MetaReducer<State>> = [];

export function createCacheKey (params: Params): string {
  return JSON.stringify(params, Object.keys(params).sort());
}
