import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { take } from 'rxjs';

import { SingleSignOnService } from 'src/app/core/services/single-sign-on.service';

@Component({
  selector: 'app-debug-sso',
  templateUrl: './debug-sso.component.html',
  styleUrls: ['./debug-sso.component.scss']
})
export class DebugSsoComponent implements OnInit {
  /**
   * User profile fetched from Keycloak
   */
  public userProfile: KeycloakProfile | null = null;

  /**
   * User profile split into key: value pairs, to display in a table
   */
  userProfileKeyValues: Array<{ key: string, value: any }> = [];

  /**
   * Table setup
   */
  displayedColumns: string[] = ['key', 'value'];

  /**
   * Current authentication token
   */
  public token: string = "";

  /**
    * Authentication token split into key: value pairs, to display in a table
    */
  tokenHeaderKeyValues: Array<{ key: string, value: any }> = [];
  tokenPayloadKeyValues: Array<{ key: string, value: any }> = [];

  constructor(public readonly _singleSignOnService: SingleSignOnService) { }

  ngOnInit(): void {
    // Subscribe to updates to the UserProfile
    this._singleSignOnService.userProfile$
      .pipe(take(1))
      .subscribe((userProfile: KeycloakProfile | null) => {
        // Store user profile object
        this.userProfile = userProfile;

        // Split user profile into key: value pairs, for display in the table
        if (!!userProfile) this.userProfileKeyValues = Object.keys(userProfile as any).map((key) => {
          return {
            key: key,
            value: JSON.stringify((userProfile as any)[key])
          };
        });
      });

    // Subscribe to updates to the token
    this._singleSignOnService.token$
      .pipe(take(1))
      .subscribe((token: string) => {
        // Store the token object
        this.token = token;

        // Token may be null, let's not process it if it's null
        if (!token) return;

        // TODO: Parse JTW, decode and split into
        const tokenSplit: Array<string> = token.split('.');
        const tokenSplitDecoded: Array<string> = tokenSplit.slice(0, 2).map((encoded) => atob(encoded));
        const header: any = JSON.parse(tokenSplitDecoded[0]);
        const payload: any = JSON.parse(tokenSplitDecoded[1]);

        // Split user profile into key: value pairs, for display in the table
        if (!!header) this.tokenHeaderKeyValues = Object.keys(header as any).map((key) => {
          return {
            key: key,
            value: JSON.stringify((header as any)[key])
          };
        });

        // Split user profile into key: value pairs, for display in the table
        if (!!payload) this.tokenPayloadKeyValues = Object.keys(payload as any).map((key) => {
          return {
            key: key,
            value: JSON.stringify((payload as any)[key])
          };
        });
      });
  }

}
