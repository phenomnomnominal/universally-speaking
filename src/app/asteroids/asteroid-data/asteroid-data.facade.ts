import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { merge, Observable, OperatorFunction } from 'rxjs';
import { ignoreElements, map, tap } from 'rxjs/operators';

import { AsyncItem, RouterSelectors } from '../../state';
import { IAsteroidDataOptions, IAsteroidDataResponse } from './asteroid-data.reducer';
import { AsteroidDataSelectors } from './asteroid-data.selectors';

@Injectable({
  providedIn: 'root'
})
export class AsteroidDataFacade {
  constructor (
    private _router: Router,
    private _store: Store<any>
  ) { }

  public dispatchAndSelectAsteroidData (params: IAsteroidDataOptions): Observable<AsyncItem<IAsteroidDataResponse>> {
    this._router.navigate(['.'], { queryParams: { ...params, page: null }, queryParamsHandling: 'merge' });
    return this.getAsteroidData();
  }

  public getAsteroidData (): Observable<AsyncItem<IAsteroidDataResponse>> {
    return this._store.select(AsteroidDataSelectors.currentAsteroidData);
  }

  public getAsteroidSearchParams (): Observable<IAsteroidDataOptions> {
    return this._store.pipe(
      select(RouterSelectors.currentQueryParams),
      map(params => params as IAsteroidDataOptions));
  }

  public getAsteroidResultPage (): Observable<number> {
    return this._store.pipe(
      select(RouterSelectors.currentQueryParams),
      map(params => params.page as number)
    );
  }
}

export function dispatchAndSelect<T, R> (handler: (options: T) => void, output$: Observable<R>): OperatorFunction<T, R> {
  return (options$: Observable<T>) => {
    return merge(
      options$.pipe(tap(options => handler(options)), ignoreElements()),
      output$
    );
  };
}
