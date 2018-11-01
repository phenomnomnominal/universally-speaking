import { Action } from '@ngrx/store';

import { IAsteroidDataOptions, IAsteroidDataResponse } from './asteroid-data.reducer';

export enum AsteroidDataActionTypes {
  GET = '[AsteroidData] Get',
  GET_FROM_API = '[AsteroidData] Get from API',
  GET_FROM_API_SUCCESS = '[AsteroidData] Get from API success',
  GET_FROM_API_FAIL = '[AsteroidData] Get from API fail'
}

export class GetAsteroidDataAction implements Action {
  public static TYPE = AsteroidDataActionTypes.GET;
  public readonly type = AsteroidDataActionTypes.GET;

  constructor (
    public options: IAsteroidDataOptions = {}
  ) { }
}

export class GetAsteroidDataFromApiAction implements Action {
  public static TYPE = AsteroidDataActionTypes.GET_FROM_API;
  public readonly type = AsteroidDataActionTypes.GET_FROM_API;

  constructor (
    public options: IAsteroidDataOptions
  ) { }
}

export class GetAsteroidDataFromApiSuccessAction implements Action {
  public static TYPE = AsteroidDataActionTypes.GET_FROM_API_SUCCESS;
  public readonly type = AsteroidDataActionTypes.GET_FROM_API_SUCCESS;

  constructor (
    public options: IAsteroidDataOptions,
    public response: IAsteroidDataResponse,
    public cachedAt: string
  ) { }
}

export class GetAsteroidDataFromApiFailAction implements Action {
  public static TYPE = AsteroidDataActionTypes.GET_FROM_API_FAIL;
  public readonly type = AsteroidDataActionTypes.GET_FROM_API_FAIL;

  constructor (
    public options: IAsteroidDataOptions,
    public error: Error
  ) { }
}

export type AsteroidDataActions = GetAsteroidDataAction | GetAsteroidDataFromApiAction | GetAsteroidDataFromApiSuccessAction | GetAsteroidDataFromApiFailAction;
