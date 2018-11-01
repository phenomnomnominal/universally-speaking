import { State } from './state';

export enum TransferStateActionTypes {
  TRANSFER_STATE = '[TransferState] Transfer'
}

export class TransferStateAction {
    public static TYPE = TransferStateActionTypes.TRANSFER_STATE;
    public readonly type = TransferStateActionTypes.TRANSFER_STATE;
    constructor (
        public state: Partial<State>
    ) { }
}
