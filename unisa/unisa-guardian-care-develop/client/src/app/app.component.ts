import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutes } from './core/models/routes.model';
import { AuthService } from './core/services/auth.service';
import { FeatureFlag } from './shared/models/feature-flag.model';
import { FeatureFlagService } from './shared/services/feature-flag.service';
import { SingleSignOnService } from './core/services/single-sign-on.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Make enum available to template
     */
    FeatureFlag = FeatureFlag;

    constructor(
        public readonly authService: AuthService,
        public readonly featureFlagService: FeatureFlagService,
        private readonly _router: Router,
        public readonly singleSignOnService: SingleSignOnService,
    ) { }

    public async ngOnInit() {
        await this.singleSignOnService.initialise();
    }

    /**
    * Handler for Home button click
    */
    onHome(): void {
        this._router.navigate([AppRoutes.HOME]);
    }

    /**
     * Handler for Sign In button click
     */
    onLogin(): void {
        if (this.featureFlagService.isOn(FeatureFlag.FEATURE_SINGLE_SIGN_ON)) {
            this.singleSignOnService.login();
        } else {
            this._router.navigate([AppRoutes.LOGIN])
        }
    }

    /**
     * Handler for Sign In button click
     */
    onSignUp(): void {
        if (this.featureFlagService.isOn(FeatureFlag.FEATURE_SINGLE_SIGN_ON)) {
            this.singleSignOnService.signUp();
        } else {
            this._router.navigate([AppRoutes.REGISTER])
        }
    }

    /**
     * Handler for Sign Out button click
     */
    onLogout(): void {
        if (this.featureFlagService.isOn(FeatureFlag.FEATURE_SINGLE_SIGN_ON)) {
            this.singleSignOnService.logout();
        } else {
            this.authService.logout();
        }
    }

    /**
     * Handler for Settings button click
     */
    onSettings(): void {
        // Navigate to settings page
        window.location.href = "http://localhost:8080/realms/guardian/account"
    }
}
