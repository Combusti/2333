import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs';

import { AdminService } from 'src/app/core/services/admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    /**
     * Table setup
     */
    columnsUsers: string[] = ['id', 'username', 'password', 'passwordHash'];
    columnsEnvironment: string[] = ['key', 'value'];

    /**
     * Environment variables split into key value pairs
     */
    environmentKeyValues: Array<{ key: string, value: any }> = [];

    constructor(readonly adminService: AdminService) { }

    ngOnInit(): void {

        this.adminService.environment$.pipe(
            filter((environment) => !!environment),
            take(1)
        ).subscribe((environment) => {
            // Split JSON key: value pairs, for display in the table
            if (!!environment) this.environmentKeyValues = Object.keys(environment as any).map((key) => {
                return {
                    key: key,
                    value: JSON.stringify((environment as any)[key])
                };
            });
        })

    }

}
