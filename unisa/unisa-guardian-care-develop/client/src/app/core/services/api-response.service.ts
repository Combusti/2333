import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OperatorFunction, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseService {

  constructor(private readonly _http: HttpClient, private _snackBar: MatSnackBar) { }

    /**
     * Taps into an API response observable and displays a success message.
     * @returns tap() rxjs function, so observable continues as usual
     */
     showSuccessMessage<T>(message: string): OperatorFunction<T, T> {
        // By returning a tap, to original observable continues as usual
        return tap(() => {
            this._snackBar.open(message)
        });
    }
}
