import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreRoutingModule } from './core-routing.module';

import { AdminComponent } from './components/admin/admin.component';
import { DebugComponent } from './components/debug/debug.component';
import { DebugLegacyComponent } from './components/debug-legacy/debug-legacy.component';
import { DebugSsoComponent } from './components/debug-sso/debug-sso.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    DebugComponent,
    DebugLegacyComponent,
    DebugSsoComponent,
    HomeComponent,
    LoginComponent,
    ProductsComponent,
    RegisterComponent,
    UnauthorisedComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule
  ],
  providers: []
})
export class CoreModule { }
