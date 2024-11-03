import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { inject } from '@angular/core';

import { dashboardRoutes } from "./pages/dashboard/dashboard.routes";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';

const authCanMatch: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const isLogedIn = true;
  if (isLogedIn) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/login'));
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    canMatch: [authCanMatch],
    component: DashboardComponent,
    children: dashboardRoutes
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];
