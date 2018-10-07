export type SortParam = 'score' | 'value' | 'accessibility' | 'upcoming' | 'smallest' | 'moid';

export interface SortOption {
  name: string;
  param: SortParam;
}

export const SORT_OPTIONS = [{
    name: 'Most cost effective',
    param: 'score'
  }, {
    name: 'Most valuable',
    param: 'value'
  }, {
    name: 'Most accessible',
    param: 'accessibility'
  }, {
    name: 'Upcoming passes',
    param: 'upcoming'
  }, {
    name: 'Smallest',
    param: 'smallest'
  }, {
    name: 'Closest approaching',
    param: 'moid'
  }
];

export const [INITIAL_SORT] = SORT_OPTIONS;

export type ShowParam = 10 | 100 | 300 | 500 | 1000 | 4000;

export type ShowOption = ShowParam;

export const SHOW_OPTIONS: Array<ShowParam> = [
  10,
  100,
  300,
  500,
  1000,
  4000
];

export const [INITIAL_SHOW] = SHOW_OPTIONS;
