import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { AppRoutes } from 'src/app/core/models/routes.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    loginForm: FormGroup;

    constructor(private readonly _authService: AuthService, private readonly _router: Router) {
        this.loginForm = new FormGroup({
            username: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required)
        });
    }

    onLogin(): void {
        // Handle invalid form
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        // login the user
        this._authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);
    }

    /**
     * Construct validation error messages
     */
    getErrorMessage(formControlName: string) {
        // Handle required
        return this.loginForm.get(formControlName)?.hasError('required') ? 'You must enter a value' : '';
    }

}
