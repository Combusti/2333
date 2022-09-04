import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, take } from 'rxjs';
import { AdminService } from 'src/app/core/services/admin.service';

@Injectable({
    providedIn: 'root'
})
export class AdminResolver implements Resolve<any> {
    constructor(private readonly _adminService: AdminService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return forkJoin([
            this._adminService.getEnvironment().pipe(take(1)),
            this._adminService.getUsers().pipe(take(1)),
        ]);
    }
}
