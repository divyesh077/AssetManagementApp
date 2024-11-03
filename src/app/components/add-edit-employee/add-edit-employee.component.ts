import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { text } from 'stream/consumers';
import { EmployeeRole } from '../../interfaces/employee-role';
import { Gender } from '../../interfaces/gender';
import { EmployeesService } from '../../services/employees.service';
import { Employee } from '../../interfaces/employee';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
import { ApiResponse } from '../../interfaces/api-response';
import { ApiErrorResponse } from '../../interfaces/api-error-response';
import { SnackBarService } from '../../services/snack-bar.service';


@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class AddEditEmployeeComponent implements OnInit {
  addressForm!: FormGroup;
  mode: 'add' | 'edit' = 'add';
  selectedEmployeeId: string | null = null;
  selectedEmployee: Employee | null = null;
  isEmployeeAddOrEdit: boolean = false;
  genders: Gender[] = [
    {
      text: 'Male',
      value: 'male'
    },
    {
      text: 'Female',
      value: 'female'
    }
  ];

  roles: EmployeeRole[] = [
    {
      text: 'User',
      value: 'user'
    },
    {
      text: 'Admin',
      value: 'admin'
    }
  ]

  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private employeeService: EmployeesService = inject(EmployeesService);
  private snackbarService: SnackBarService = inject(SnackBarService);
  constructor() { };

  ngOnInit(): void {
    this.addressForm = this.initEmployeeForm();
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const employeeId = params.get('employeeId');
        if (employeeId) {
          this.mode = 'edit';
          this.selectedEmployeeId = employeeId;
          this.employeeService.getEmployeeById(this.selectedEmployeeId)
            .subscribe((employee: Employee) => {
              console.table(employee);
              this.selectedEmployee = employee;
              this.addressForm = this.initEmployeeForm();
            })
        }
      }
    )
  }

  initEmployeeForm() {
    return this.fb.group({
      usernumber: [
        this.selectedEmployee?.usernumber || '',
        Validators.required
      ],
      username: [
        this.selectedEmployee?.username || '',
        Validators.required
      ],
      firstName: [
        this.selectedEmployee?.firstname || 'f',
        Validators.required
      ],
      lastName: [
        this.selectedEmployee?.lastname || 'l',
        Validators.required
      ],
      email: [
        this.selectedEmployee?.email || '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      role: [this.selectedEmployee?.role || 'user'],
      gender: ['male'],
    });
  }
  getFormControl(controlName: string): FormControl {
    return this.addressForm.get(controlName) as FormControl;
  }
  onSubmit(): void {
    //console.log(this.addressForm.value);
    const { username, usernumber, email, role, gender } = this.addressForm.value;
    const empData: Employee = {
      username: username,
      usernumber: usernumber,
      email: email,
      firstname: 'f',
      lastname: 'l',
      role: role
    }
    if (this.mode === 'edit' && this.selectedEmployeeId) {
      this.isEmployeeAddOrEdit = true;
      this.employeeService.editEmployee(this.selectedEmployeeId, empData)
        .subscribe({
          next: (response: ApiResponse) => {
            this.isEmployeeAddOrEdit = false;
            this.snackbarService.openSuccessSnackBar("Employee edited successfully!")
          },
          error: (err: ApiErrorResponse) => {
            this.isEmployeeAddOrEdit = false;
          }
        });
    }
    else {
      const password = "India@123";
      this.isEmployeeAddOrEdit = true;
      this.authService.register(username, usernumber, email, password)
        .subscribe({
          next: (response: ApiResponse) => {
            this.isEmployeeAddOrEdit = false;
            this.snackbarService.openSuccessSnackBar("Employee created successfully!")
          },
          error: (err: ApiErrorResponse) => {
            this.isEmployeeAddOrEdit = false;
          }
        });

    }
  }
}
