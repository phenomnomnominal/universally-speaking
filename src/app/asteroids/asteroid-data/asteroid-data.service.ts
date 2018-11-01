import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAsteroidDataOptions, IAsteroidDataResponse } from './asteroid-data.reducer';

const ASTEROID_DATA_URL = '/api/rankings';

@Injectable({
  providedIn: 'root'
})
export class AsteroidDataService {
  constructor (
    private _httpClient: HttpClient
  ) { }

  public getAsteroidData (options: IAsteroidDataOptions): Observable<IAsteroidDataResponse> {
    return this._httpClient.get<IAsteroidDataResponse>(ASTEROID_DATA_URL, {
      params: {
        sort_by: options.sort,
        limit: `${options.show}`
      }
    });
  }
}
