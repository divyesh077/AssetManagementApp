import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  private snackBar = inject(MatSnackBar)

  constructor() { }

  openSuccessSnackBar(message: string): MatSnackBarRef<SnackBarComponent> {
    const durationInSeconds: number = 1;
    const config: MatSnackBarConfig = {
      data: {
        success: true,
        message: message
      },
      duration: durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    };
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, config);
    return snackBarRef;
  }

  openErrorSnackBar(message: string): MatSnackBarRef<SnackBarComponent> {
    const config: MatSnackBarConfig = {
      data: {
        success: false,
        message: message
      },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    }
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, config);
    return snackBarRef;
  }
}
