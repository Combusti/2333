import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppRoutes } from 'src/app/core/models/routes.model';

/**
 * Intercepts API responses to globally handle API errors
 */
@Injectable({
    providedIn: 'root'
})
export class ApiErrorInterceptor implements HttpInterceptor {

    constructor(private readonly _router: Router, private _snackBar: MatSnackBar) { }

    /**
     * Intercept HTTP responses (middleware)
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("error");

        return next.handle(req).pipe(
            catchError(error => {
                switch (error.status) {
                    case 401: {
                        const errorMessage = error.error.description ? error.error.description : 'Something went wrong...'
                        this._snackBar.open("Error: " + error.error.description)
                        this._router.navigate([AppRoutes.UNAUTHORISED]);
                        return of(error);
                    }
                    default: {
                        const errorMessage = error.error.description ? error.error.description : 'Something went wrong...'
                        this._snackBar.open("Error: " + errorMessage)
                        return of(error);
                    }
                }
            })
        );
    }
}
