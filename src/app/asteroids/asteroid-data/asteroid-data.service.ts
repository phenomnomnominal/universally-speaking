import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GetAsteroidData } from './asteroid-data.actions';

const ASTEROID_DATA_URL = '/api/rankings';

@Injectable({
  providedIn: 'root'
})
export class AsteroidDataService {
  constructor (
    private _httpClient: HttpClient
  ) { }

  public getAsteroidData (action: GetAsteroidData): Observable<AsteroidData> {
    if (!action.sort || !action.show) {
      return null;
    }
    return this._httpClient.get<AsteroidData>(ASTEROID_DATA_URL, {
      params: {
        sort_by: action.sort,
        limit: `${action.show}`
      }
    });
  }
}

type AsteroidClass = 'MBA' | 'OMB' | 'CEN' | 'TJN' | 'MCA' | 'APO' | 'AMO' | 'IMB' | 'IEO' | 'ATE' | 'TNO';
type AsteroidCondition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type AsteroidBoolean = 'Y' | 'N';
type AsteroidDate = string;

export interface Asteroid {
  BV: number;
  G: number;
  H: number;
  UB: number;
  a: number;
  ad: number;
  albedo: number;
  class: AsteroidClass;
  closeness: number;
  condition_code: AsteroidCondition;
  data_arc: number;
  diameter: number;
  diameter_sigma: number;
  dv: number;
  e: number;
  epoch: number;
  epoch_cal: number;
  epoch_mjd: number;
  equinox: 'J2000';
  first_obs: AsteroidDate;
  full_name: string;
  i: number;
  id: string;
  last_obs: AsteroidDate;
  ma: number;
  moid: number;
  moid_jup: number;
  moid_ld: number;
  n: number;
  n_obs_used: number;
  name: string;
  neo: AsteroidBoolean;
  om: number;
  orbit_id: string;
  pdes: number;
  per: number;
  per_y: number;
  pha: AsteroidBoolean;
  price: number;
  producer: string;
  profit: number;
  prov_des: string;
  q: number;
  rms: number;
  rot_per: number;
  saved: number;
  score: number;
  sigma_a: number;
  sigma_ad: number;
  sigma_e: number;
  sigma_i: number;
  sigma_ma: number;
  sigma_n: number;
  sigma_om: number;
  sigma_per: number;
  sigma_q: number;
  sigma_tp: number;
  sigma_w: number;
  spec: string;
  spec_B: string;
  spec_T: string;
  spkid: number;
  t_jup: number;
  tp: number;
  tp_cal: number;
  w: number;
}

export type AsteroidData = Array<Asteroid>;
