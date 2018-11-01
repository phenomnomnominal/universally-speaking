import { makeStateKey } from '@angular/platform-browser';

export interface State {
    [key: string]: any;
}

export const STATE_KEY = makeStateKey<Partial<State>>('STORE_STATE');
