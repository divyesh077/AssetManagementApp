import { Routes } from "@angular/router";

import { EmployeeListComponent } from "../../components/employee-list/employee-list.component";
import { AddEditEmployeeComponent } from "../../components/add-edit-employee/add-edit-employee.component";

import { AssetListComponent } from "../../components/asset-list/asset-list.component";
import { AssetDetailsComponent } from "../../components/asset-details/asset-details.component";
import { AddEditAssetComponent } from "../../components/add-edit-asset/add-edit-asset.component";
import { HomeComponent } from "../../components/home/home.component";
import { EmployeeProfileComponent } from "../../components/employee-profile/employee-profile.component";
import { authGuard } from "../../guards/auth.guard";


export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'employees',
    component: EmployeeListComponent
  },
  {
    path: 'employees/:employeeId',
    component: EmployeeProfileComponent
  },
  {
    path: 'add-employee',
    component: AddEditEmployeeComponent
  },
  {
    path: 'edit-employee/:employeeId',
    component: AddEditEmployeeComponent
  },
  {
    path: 'assets',
    component: AssetListComponent,
    // canMatch: [authGuard]
  },
  {
    path: 'assets/:assetId',
    component: AssetDetailsComponent,
  },
  {
    path: 'add-asset',
    component: AddEditAssetComponent,
  },
  {
    path: 'edit-asset/:assetId',
    component: AddEditAssetComponent,
  },
  {
    path: 'setting',
    component: AssetListComponent
  },
  {
    path: 'logout',
    component: AssetListComponent
  }
];
