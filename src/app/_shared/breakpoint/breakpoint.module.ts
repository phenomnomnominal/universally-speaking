import { NgModule } from '@angular/core';

import { BreakpointDirective } from './breakpoint.directive';

@NgModule({
    declarations: [
        BreakpointDirective
    ],
    exports: [
        BreakpointDirective
    ]
})
export class BreakpointModule { }
