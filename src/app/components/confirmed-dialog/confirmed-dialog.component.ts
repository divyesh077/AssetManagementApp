import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmedDialogData } from '../../interfaces/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmed-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContainer,
    MatDialogContent,
    MatButtonModule
  ],
  templateUrl: './confirmed-dialog.component.html',
  styleUrl: './confirmed-dialog.component.scss'
})
export class ConfirmedDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmedDialogComponent>);
  readonly data = inject<ConfirmedDialogData>(MAT_DIALOG_DATA);

  title = this.data.title || 'localhost:3000';
  message = this.data.message;
  closeText = this.data.closeText || 'Close';
  actionText = this.data.actionText || 'Ok';


  onAction() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
}
