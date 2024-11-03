import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, take, tap } from 'rxjs';
import { Employee } from '../../interfaces/employee';
import { EmployeesService } from '../../services/employees.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AssetsService } from '../../services/assets.service';
import { AssetAssignToEmployeeData } from '../../interfaces/dialog';

@Component({
  selector: 'app-asset-assign-to-employee',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent
  ],
  templateUrl: './asset-assign-to-employee.component.html',
  styleUrl: './asset-assign-to-employee.component.scss'
})
export class AssetAssignToEmployeeComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AssetAssignToEmployeeComponent>);
  readonly data = inject<AssetAssignToEmployeeData>(MAT_DIALOG_DATA);

  assetId: string = this.data.assetId;
  selectedEmployee: string | null = null;
  employees: Employee[] = [];

  constructor() { }
  private employeesService = inject(EmployeesService);
  ngOnInit(): void {
    this.employeesService.getEmployees()
      .subscribe(result => this.employees = result.employees)
  }

  onCancel() {
    this.dialogRef.close();
  }
}
