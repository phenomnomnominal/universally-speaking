import { NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { STATE_KEY, State } from './state';

@NgModule({
    imports: [BrowserTransferStateModule]
})
export class ServerStateModule {
    constructor (
        private _transferState: TransferState,
        private _store: Store<State>
    ) {
        this._transferState.onSerialize(STATE_KEY, () => {
            let stateToTransfer = null;
            this._store.pipe(
                select(state => state),
                take(1),
            ).subscribe(state => stateToTransfer = state);

            return stateToTransfer;
        });
    }
}
