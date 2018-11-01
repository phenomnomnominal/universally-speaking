import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { routerReducer } from '@ngrx/router-store';

import { State } from './state';
import { stateTransferReducer } from './state-transfer.reducer';

export * from './async-item';
export * from './cache.service';
export * from './client-state.module';
export * from './route-selectors';
export * from './server-state.module';
export * from './state';
export * from './state-transfer.reducer';

export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};

export const metaReducers: Array<MetaReducer<State>> = [stateTransferReducer];
