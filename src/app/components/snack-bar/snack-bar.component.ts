import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarData } from '../../interfaces/snack-bar-data';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarModule
  ],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {
  readonly snackBarRef = inject(MatSnackBarRef<SnackBarComponent>);
  readonly data = inject<SnackBarData>(MAT_SNACK_BAR_DATA);
  message: string = this.data.message;

  constructor() { }

  onAction() {
    this.snackBarRef.dismissWithAction();
  }
}
