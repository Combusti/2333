import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, take, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AppRoutes } from 'src/app/core/models/routes.model';
import { User } from 'src/app/core/models/user.model';
import { FeatureFlagService } from 'src/app/shared/services/feature-flag.service';
import { FeatureFlag } from 'src/app/shared/models/feature-flag.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // API routes
    private readonly ROUTE_AUTH_REGISTER = '/auth/register';
    private readonly ROUTE_AUTH_LOGIN = '/auth/login';
    private readonly ROUTE_AUTH_LOGOUT = '/auth/logout';
    private readonly ROUTE_AUTH_USER_LIST = '/auth/user/list';

    // Local data store
    private readonly _authenticated = new BehaviorSubject<boolean>(false);
    readonly authenticated$ = this._authenticated.asObservable();

    private readonly _users = new BehaviorSubject<Array<User>>([]);
    readonly users$ = this._users.asObservable();

    // Constants
    private readonly COOKIE_NAME = 'session'

    constructor(
        private readonly _apiResponseService: ApiResponseService,
        private readonly _featureFlagService: FeatureFlagService,
        private readonly _http: HttpClient,
        private readonly _router: Router
    ) {
        // Set authentication state on app load
        // User is authenticated if the cookie has a value AND we are on legacy authentication
        const hasCookie = !!this.getCookie(this.COOKIE_NAME);
        const isLegacyAuth = !_featureFlagService.isOn(FeatureFlag.FEATURE_SINGLE_SIGN_ON)
        this._authenticated.next(hasCookie && isLegacyAuth);
    }

    /**
     * Create account
     */
    register(username: string, password: string): Observable<Object> {
        // Construct form data
        const formData: any = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        // Make API request
        return this._http.post(`${environment.apiUrl}/${this.ROUTE_AUTH_REGISTER}`, formData).pipe(
            this._apiResponseService.showSuccessMessage("Account successfully created")
        );
    }

    /**
     * Log in
     */
    login(username: string, password: string): Subscription {
        // Construct form data
        const formData: any = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        // Make API request
        return this._http.post(`${environment.apiUrl}/${this.ROUTE_AUTH_LOGIN}`, formData).pipe(
            this._apiResponseService.showSuccessMessage("Successfully logged in"),
            take(1),
            tap(() => this._authenticated.next(true))
        ).subscribe(() => this._router.navigate([AppRoutes.HOME]));
    }

    /**
     * Log out
     */
    logout(): Subscription {
        // Make API request
        return this._http.post(`${environment.apiUrl}/${this.ROUTE_AUTH_LOGOUT}`, null).pipe(
            this._apiResponseService.showSuccessMessage("Successfully logged out"),
            take(1),
            tap(() => this._authenticated.next(false))
        ).subscribe(() => this._router.navigate([AppRoutes.HOME]));
    }

    /**
     * Get the users list
     */
    getUsers(): Observable<Array<User>> {
        // Allow request to contain credentials
        const options = { withCredentials: true }
        // Make API request
        return this._http.get<Array<User>>(`${environment.apiUrl}/${this.ROUTE_AUTH_USER_LIST}`, options).pipe(
            take(1),
            tap((users) => this._users.next(users))
        );
    }

    /**
     * Point in time accessors
     */
    get isAuthenticated(): boolean {
        return this._authenticated.getValue();
    }

    get users(): Array<User> {
        return this._users.getValue();
    }

    /**
     * Get the value of the specified cookie
     */
    private getCookie(cookieName: string): string {
        let name = cookieName + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}
