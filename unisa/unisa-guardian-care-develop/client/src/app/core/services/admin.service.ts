import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap, switchMap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    // API routes
    private readonly ROUTE_ADMIN_ENVIRONMENT = '/admin/environment';
    private readonly ROUTE_ADMIN_USER_LIST = '/admin/user/list';

    // Local data store
    private readonly _environment = new BehaviorSubject<any>([]);
    readonly environment$ = this._environment.asObservable();

    private readonly _users = new BehaviorSubject<Array<User>>([]);
    readonly users$ = this._users.asObservable();

    constructor(private readonly _http: HttpClient) { }

    /**
     * Environment variables
     */
    // Load environment variables from the API
    getEnvironment(): Observable<any | undefined> {
        return this._http.get<any>(`${environment.apiUrl}/${this.ROUTE_ADMIN_ENVIRONMENT}`).pipe(
            tap((environment) => {
                this._environment.next(environment);
            }),
            switchMap(() => this.environment$)
        );
    }

    // public getter to retrieve environment variables from local store
    get environment(): any {
        return this.environment.getValue();
    }

    /**
     * Users
     */
    getUsers(): Observable<Array<User>> {
        // Make API request
        return this._http.get<Array<User>>(`${environment.apiUrl}/${this.ROUTE_ADMIN_USER_LIST}`).pipe(
            take(1),
            tap((users) => this._users.next(users))
        );
    }

    // public getter to retrieve user list from local store
    get users(): Array<User> {
        return this._users.getValue();
    }
}
