import { NgModule } from '@angular/core';

import { FuzzyPipe } from './fuzzy.pipe';

@NgModule({
    declarations: [
        FuzzyPipe
    ],
    exports: [
        FuzzyPipe
    ],
    providers: [
        FuzzyPipe
    ]
})
export class FuzzyModule { }
