import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject } from "rxjs";
import { FeatureFlagService } from "src/app/shared/services/feature-flag.service";
import { FeatureFlag } from "src/app/shared/models/feature-flag.model";

@Injectable({
    providedIn: 'root',
})
export class SingleSignOnService {
    private _isLoggedIn = new BehaviorSubject<boolean>(false);
    readonly isLoggedIn$ = this._isLoggedIn.asObservable();

    private _userProfile = new BehaviorSubject<KeycloakProfile | null>(null);
    readonly userProfile$ = this._userProfile.asObservable();

    private _token = new BehaviorSubject<string>("");
    readonly token$ = this._token.asObservable();

    constructor(private readonly _keycloak: KeycloakService, private readonly _featureFlagService: FeatureFlagService) { }

    /**
     * This function runs each time the app loads, including 
     * when we get redirected back grom the Keycloak login page.
     */
    public async initialise() {
        // Check whether we're logged in
        this.isLoggedIn = await this._keycloak.isLoggedIn();

        // If we're logged in, fetch information about the user
        if (this.isLoggedIn) {
            this.userProfile = await this._keycloak.loadUserProfile();
            this.token = await this._keycloak.getToken();
        }
    }

    /**
     * Send the user to the Keycloak login page
     */
    public login() {
        this._keycloak.login({redirectUri: "http://localhost:4200/home"});
    }

    public signUp() {
        this._keycloak.register({redirectUri: "http://localhost:4200/home"});
    }

    public logout() {
        this._keycloak.logout("http://localhost:4200/home");
    }

    /**
     * The functions below are getters and setters so we can 
     * add state changes to the observables.
     * i.e. when a value changes, let the rest of the app know.
     * 
     * You shouldn't need to change these.
     */
    get isLoggedIn(): boolean {
        return this._isLoggedIn.getValue();
    }

    private set isLoggedIn(val: boolean) {
        this._isLoggedIn.next(val);
    }

    get userProfile(): KeycloakProfile | null {
        return this._userProfile.getValue();
    }

    private set userProfile(val: KeycloakProfile | null) {
        this._userProfile.next(val);
    }

    get token(): string {
        return this._token.getValue();
    }

    private set token(val: string) {
        this._token.next(val);
    }

    get isAdmin(): boolean {
        // Handle RBAC is disabled
        if(!this._featureFlagService.isOn(FeatureFlag.FEATURE_ROLE_BASED_ACCESS_CONTROLS)) return true;

        // Attempt to get the current token
        const token = this._token.getValue();

        // Handle no token
        if(!token) return false;

        // Parse the token and check whether the user is in the admin role
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        return decodedToken.realm_access?.roles?.includes('admin');
    }
}