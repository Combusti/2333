import { Component } from '@angular/core';
import { FeatureFlag } from 'src/app/shared/models/feature-flag.model';

import { FeatureFlagService } from 'src/app/shared/services/feature-flag.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
    FeatureFlag = FeatureFlag;

  constructor(public readonly featureFlagService: FeatureFlagService) { }

}
