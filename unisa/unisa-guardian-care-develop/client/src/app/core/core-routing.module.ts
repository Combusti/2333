import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminResolver } from './resolvers/admin.resolver';
import { AppRoutes } from './models/routes.model';
import { ProductResolver } from './resolvers/product.resolver';
import { DebugResolver } from './resolvers/debug.resolver';

import { AdminComponent } from './components/admin/admin.component';
import { DebugComponent } from './components/debug/debug.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';


const routes: Routes = [
  // UNAUTHENTICATED ROUTES
  {
    path: AppRoutes.HOME,
    component: HomeComponent
  },
  {
    path: AppRoutes.PLANS,
    component: ProductsComponent,
    resolve: {
      productData: ProductResolver
    }
  },
  {
    path: AppRoutes.UNAUTHORISED,
    component: UnauthorisedComponent
  },
  // AUTH ROUTES
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent
  },
  {
    path: AppRoutes.REGISTER,
    component: RegisterComponent
  },
  // AUTHENTICATED ROUTES
  {
    path: AppRoutes.ADMIN,
    component: AdminComponent,
    resolve: {
      adminData: AdminResolver
    }
  },
  {
    path: AppRoutes.DEBUG,
    component: DebugComponent,
    resolve: {
        debugData: DebugResolver
    }
  },
  { path: '**', redirectTo: AppRoutes.HOME }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
