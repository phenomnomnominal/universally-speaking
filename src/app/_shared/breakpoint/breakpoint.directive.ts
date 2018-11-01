import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[usBreakpoint]'
})
export class BreakpointDirective implements OnChanges {
    @Input() public sm: boolean;
    @Input() public sd: boolean;
    @Input() public md: boolean;
    @Input() public mg: boolean;
    @Input() public lg: boolean;
    @Input() public ll: boolean;
    @Input() public xl: boolean;

    @HostBinding('class.h-hidden-sm-only') public hiddenSm: boolean;
    @HostBinding('class.h-hidden-sd-only') public hiddenSd: boolean;
    @HostBinding('class.h-hidden-md-only') public hiddenMd: boolean;
    @HostBinding('class.h-hidden-mg-only') public hiddenMg: boolean;
    @HostBinding('class.h-hidden-lg-only') public hiddenLg: boolean;
    @HostBinding('class.h-hidden-ll-only') public hiddenLl: boolean;
    @HostBinding('class.h-hidden-xl')  public hiddenXl: boolean;

    public ngOnChanges (): void {
        this._updateHidden();
    }

    private _updateHidden (): void {
        const visibleSm = this.sm;
        const visibleSd = this.sd != null ? this.sd : visibleSm;
        const visibleMd = this.md != null ? this.md : visibleSd;
        const visibleMg = this.mg != null ? this.mg : visibleMd;
        const visibleLg = this.lg != null ? this.lg : visibleMg;
        const visibleLl = this.ll != null ? this.ll : visibleLg;
        const visibleXl = this.xl != null ? this.xl : visibleLl;
        this.hiddenSm = !visibleSm;
        this.hiddenSd = !visibleSd;
        this.hiddenMd = !visibleMd;
        this.hiddenMg = !visibleMg;
        this.hiddenLg = !visibleLg;
        this.hiddenLl = !visibleLl;
        this.hiddenXl = !visibleXl;
    }
}
