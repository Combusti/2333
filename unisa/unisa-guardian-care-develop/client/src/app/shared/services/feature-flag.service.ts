import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { FeatureFlags } from 'src/app/shared/models/feature-flag.model';
import { FeatureFlagsKeys } from 'src/app/shared/models/feature-flag.model';

// file deepcode ignore DuplicateCaseBody: To be explicit for each toggle case
@Injectable({
    providedIn: 'root'
})
export class FeatureFlagService {
    /**
     * our current features
     */
     private _features: FeatureFlags = {} as FeatureFlags;

     constructor() {
         this._features = environment;
     }
 
     /**
      * check if a feature is switched on
      */
     isOn(key: FeatureFlagsKeys): boolean {
         // The intended behaviour is that feature flags that are present are enabled / disabled based on their value.
         // Feature flags that are not present are enabled by default.
         // This makes it safer to trim feature flags as features become stable and flags are not required.
         return this._features[key] === undefined ? true : this._features[key];
     }
}
