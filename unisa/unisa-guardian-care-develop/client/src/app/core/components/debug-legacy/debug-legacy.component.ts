import { Component } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-debug-legacy',
    templateUrl: './debug-legacy.component.html',
    styleUrls: ['./debug-legacy.component.scss']
})
export class DebugLegacyComponent {
    /**
     * Table setup
     */
    displayedColumns: string[] = ['id', 'username', 'password', 'passwordHash'];

    constructor(public readonly authService: AuthService) { }

}
