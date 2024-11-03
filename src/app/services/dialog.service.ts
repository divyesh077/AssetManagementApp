import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


import { AssetAssignToEmployeeData, ConfirmedDialogData } from '../interfaces/dialog';

import { ConfirmedDialogComponent } from '../components/confirmed-dialog/confirmed-dialog.component';
import { AssetAssignToEmployeeComponent } from '../components/asset-assign-to-employee/asset-assign-to-employee.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog: MatDialog = inject(MatDialog);

  constructor() { }

  openConfirmedDialog(data: ConfirmedDialogData) {
    const config: MatDialogConfig = {
      width: '300px',
      data: data,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '500ms'
    }
    const dialogRef = this.dialog.open(ConfirmedDialogComponent, config);
    return dialogRef;
  }

  openAssetAssignToEmployeeComponent(data: AssetAssignToEmployeeData) {
    const config: MatDialogConfig = {
      width: '450px',
      data: data,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '500ms'
    }
    const dialogRef = this.dialog.open(AssetAssignToEmployeeComponent, config);
    return dialogRef;
  }
}
