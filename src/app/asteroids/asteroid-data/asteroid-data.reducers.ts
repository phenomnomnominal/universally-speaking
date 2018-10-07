import { AsyncItem } from '../../reducers';
import { AsteroidData } from './asteroid-data.service';
import { GetAsteroidDataFromAPI, GetAsteroidDataFromApiFail, GetAsteroidDataFromApiSuccess, AsteroidDataActions } from './asteroid-data.actions';

export type AsteroidDataState = AsyncItem<AsteroidData>;

export const asteroidDataInitialState: AsteroidDataState = {
  isLoading: false
};

export function asteroidDataReducer (state: AsteroidDataState, action: AsteroidDataActions): AsteroidDataState {
  switch (action.type) {
    case GetAsteroidDataFromAPI.TYPE: {
      return getAsteroidDataFromApiHandler(state);
    }
    case GetAsteroidDataFromApiSuccess.TYPE: {
      return getAsteroidDataFromApiSuccessHandler(state, action as GetAsteroidDataFromApiSuccess);
    }
    case GetAsteroidDataFromApiFail.TYPE: {
      return getAsteroidDataFromApiFailHandler(state, action as GetAsteroidDataFromApiFail);
    }
  }
  return state;
}

function getAsteroidDataFromApiHandler (state: AsteroidDataState): AsteroidDataState {
  // going to API so just set loading true
  return {
    ...state,
    isLoading: true
  };
}

function getAsteroidDataFromApiSuccessHandler (_: AsteroidDataState, action: GetAsteroidDataFromApiSuccess): AsteroidDataState {
  return {
    isLoading: false,
    item: action.response,
    error: null
  };
}

function getAsteroidDataFromApiFailHandler (state: AsteroidDataState, action: GetAsteroidDataFromApiFail): AsteroidDataState {
  return {
    ...state,
    isLoading: false,
    error: action.error
  };
}
