import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutes } from 'src/app/core/models/routes.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { FeatureFlag } from 'src/app/shared/models/feature-flag.model';
import { FeatureFlagService } from 'src/app/shared/services/feature-flag.service';
import { SingleSignOnService } from 'src/app/core/services/single-sign-on.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(
        public readonly authService: AuthService,
        private readonly _featureFlagService: FeatureFlagService,
        private readonly _router: Router,
        public readonly singleSignOnService: SingleSignOnService
    ) { }

    /**
     * Handler for Sign In button click
     */
    onSignUp(): void {
        if (this._featureFlagService.isOn(FeatureFlag.FEATURE_SINGLE_SIGN_ON)) {
            this.singleSignOnService.signUp();
        } else {
            this._router.navigate([AppRoutes.REGISTER])
        }
    }

}
