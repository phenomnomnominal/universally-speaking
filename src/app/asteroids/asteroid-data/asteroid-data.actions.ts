import { Action } from '@ngrx/store';

import { AsteroidData } from './asteroid-data.service';
import { SortParam, ShowParam } from './options';

export enum AsteroidDataActionTypes {
  GET = '[AsteroidData] Get',
  GET_FROM_API = '[AsteroidData] Get from API',
  GET_FROM_API_SUCCESS = '[AsteroidData] Get from API success',
  GET_FROM_API_FAIL = '[AsteroidData] Get from API fail'
}

export class GetAsteroidData implements Action {
  public static TYPE = AsteroidDataActionTypes.GET;
  public readonly type = AsteroidDataActionTypes.GET;

  constructor (
    public sort: SortParam,
    public show: ShowParam
  ) { }
}

export class GetAsteroidDataFromAPI implements Action {
  public static TYPE = AsteroidDataActionTypes.GET_FROM_API;
  public readonly type = AsteroidDataActionTypes.GET_FROM_API;
}

export class GetAsteroidDataFromApiSuccess implements Action {
  public static TYPE = AsteroidDataActionTypes.GET_FROM_API_SUCCESS;
  public readonly type = AsteroidDataActionTypes.GET_FROM_API_SUCCESS;

  constructor (
    public response: AsteroidData
  ) { }
}

export class GetAsteroidDataFromApiFail implements Action {
  public static TYPE = AsteroidDataActionTypes.GET_FROM_API_FAIL;
  public readonly type = AsteroidDataActionTypes.GET_FROM_API_FAIL;

  constructor (
    public error: Error
  ) { }
}

export type AsteroidDataActions = GetAsteroidData | GetAsteroidDataFromAPI | GetAsteroidDataFromApiSuccess | GetAsteroidDataFromApiFail;
