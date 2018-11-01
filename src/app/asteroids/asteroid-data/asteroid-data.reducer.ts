import { Action } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { EntityAsyncItem, createCacheKey } from '../../state';
import { AsteroidData } from './asteroid';
import { SortParam, ShowParam } from './options';

import { GetAsteroidDataFromApiAction, GetAsteroidDataFromApiFailAction, GetAsteroidDataFromApiSuccessAction } from './asteroid-data.actions';

export interface IAsteroidDataOptions {
  sort?: SortParam;
  show?: ShowParam;
}

export type IAsteroidDataResponse = AsteroidData;

export const asteroidDataAdapter = createEntityAdapter<EntityAsyncItem<IAsteroidDataResponse>>();

export const ASTEROID_DATA_FEATURE = 'asteroidData';

export interface IAsteroidDataState {
  asteroidDataEntities: EntityState<EntityAsyncItem<IAsteroidDataResponse>>;
}

export const initialState: IAsteroidDataState = {
  asteroidDataEntities: asteroidDataAdapter.getInitialState()
};

export function asteroidDataReducer (state: IAsteroidDataState = initialState, action: Action): IAsteroidDataState {
  switch (action.type) {
    case GetAsteroidDataFromApiAction.TYPE: {
      return getAsteroidDataFromApiHandler(state, action as GetAsteroidDataFromApiAction);
    }
    case GetAsteroidDataFromApiSuccessAction.TYPE: {
      return getAsteroidDataFromApiSuccessHandler(state, action as GetAsteroidDataFromApiSuccessAction);
    }
    case GetAsteroidDataFromApiFailAction.TYPE: {
      return getAsteroidDataFromApiFailHandler(state, action as GetAsteroidDataFromApiFailAction);
    }
  }
  return state;
}

function getAsteroidDataFromApiHandler (state: IAsteroidDataState, action: GetAsteroidDataFromApiAction): IAsteroidDataState {
  const id = createCacheKey(action.options);

  const cachedItems = asteroidDataAdapter.upsertOne({
    id,
    isLoading: true
  }, state.asteroidDataEntities);

  return {
    ...state,
    asteroidDataEntities: cachedItems
  };
}

function getAsteroidDataFromApiSuccessHandler (state: IAsteroidDataState, action: GetAsteroidDataFromApiSuccessAction): IAsteroidDataState {
  const id = createCacheKey(action.options);

  const cachedItems = asteroidDataAdapter.updateOne({
    id,
    changes: {
      isLoading: false,
      cachedAt: action.cachedAt,
      item: action.response
    }
  }, state.asteroidDataEntities);

  return {
    ...state,
    asteroidDataEntities: cachedItems
  };
}

function getAsteroidDataFromApiFailHandler (state: IAsteroidDataState, action: GetAsteroidDataFromApiFailAction): IAsteroidDataState {
  const id = createCacheKey(action.options);

  const cachedItems = asteroidDataAdapter.updateOne({
    id,
    changes: {
      isLoading: false,
      error: action.error
    }
  }, state.asteroidDataEntities);

  return {
    ...state,
    asteroidDataEntities: cachedItems
  };
}
