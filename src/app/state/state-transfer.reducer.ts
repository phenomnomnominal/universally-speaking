import { Action, ActionReducer } from '@ngrx/store';

import { State } from './state';
import { TransferStateAction } from './state-transfer.actions';

export function stateTransferReducer (reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state: State, action: Action) {
        if (action.type === TransferStateAction.TYPE) {
            return transferStateHandler(state, action as TransferStateAction);
        }

        return reducer(state, action);
    };
}

function transferStateHandler (currentState: State, action: TransferStateAction): State {
    const { state } = action;

    return {
        ...currentState,
        ...state
    };
}
