import { NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { STATE_KEY, State } from './state';
import { TransferStateAction } from './state-transfer.actions';

@NgModule({
    imports: [
        BrowserTransferStateModule
    ]
})
export class ClientStateModule {
    constructor (
        private _transferState: TransferState,
        private _store: Store<State>
    ) {
        if (this._transferState.hasKey(STATE_KEY)) {
            const state = this._transferState.get<State>(STATE_KEY, {});
            this._transferState.remove(STATE_KEY);

            this._store.dispatch(new TransferStateAction(state));
        }
    }
}
