import { State } from '../../reducers';
import { SortParam, ShowParam } from './options';

export const ASTEROID_DATA = 'ASTEROID_DATA';

export class AsteroidDataSelectors {
  static asteroidData = (state: State) => state[ASTEROID_DATA];
  static asteroidSearchParams = (state: State): [SortParam, ShowParam] => {
    const { queryParams } = state.router.state.root;
    return [queryParams.sort, queryParams.show];
  }
  static asteroidResultsPage = (state: State): number => {
    const { queryParams } = state.router.state.root;
    return queryParams.page;
  }
}
