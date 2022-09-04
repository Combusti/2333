import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/core/models/routes.model';

@Component({
  selector: 'app-unauthorised',
  templateUrl: './unauthorised.component.html',
  styleUrls: ['./unauthorised.component.scss']
})
export class UnauthorisedComponent  {
  /**
   * Make enums accessible to the template
   */
  AppRoutes = AppRoutes;

  constructor() { }

}
