import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { SingleSignOnService } from 'src/app/core/services/single-sign-on.service';

@Directive({
    selector: '[ifAuthenticated]'
})
export class IfAuthenticatedDirective {
    constructor(private readonly templateRef: TemplateRef<any>, private readonly viewContainer: ViewContainerRef, private readonly _singleSignOnService: SingleSignOnService) {}

    evaluateToggle(): void {
        if (this._singleSignOnService.isLoggedIn) this.viewContainer.createEmbeddedView(this.templateRef);
        else this.viewContainer.clear();
    }
}
