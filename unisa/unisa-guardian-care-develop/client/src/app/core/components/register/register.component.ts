import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { AppRoutes } from 'src/app/core/models/routes.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    registerForm: FormGroup;

    constructor(private readonly _authService: AuthService, private readonly _router: Router) {
        this.registerForm = new FormGroup({
            username: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required)
        });
    }

    onRegister(): void {
        // Handle invalid form
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        // Register the user
        this._authService.register(this.registerForm.get('username')?.value, this.registerForm.get('password')?.value)
            .pipe(take(1))
            .subscribe(() => this._router.navigate([AppRoutes.LOGIN]));
    }

    /**
     * Construct validation error messages
     */
    getErrorMessage(formControlName: string) {
        // Handle required
        return this.registerForm.get(formControlName)?.hasError('required') ? 'You must enter a value' : '';

    }

}
