import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { FeatureFlag } from 'src/app/shared/models/feature-flag.model';
import { FeatureFlagService } from 'src/app/shared/services/feature-flag.service';

@Injectable({
    providedIn: 'root'
})
export class DebugResolver implements Resolve<Array<User> | undefined> {
    constructor(private readonly _authService: AuthService, private readonly _featureFlagService: FeatureFlagService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this._featureFlagService.isOn(FeatureFlag.FEATURE_SINGLE_SIGN_ON) ? true : this._authService.getUsers().pipe(take(1));
    }
}
