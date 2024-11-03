import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Employee } from '../../interfaces/employee';
import { EmployeesService } from '../../services/employees.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { BehaviorSubject, map, merge, startWith, switchMap } from 'rxjs';
import { FilterOptions } from '../../interfaces/asset';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSortModule,
    MatDividerModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name',
    'emailId',
    'location',
    'department',
    'role',
    'status',
    'info',
    'actions',
  ];

  employees: Employee[] = [];
  employeesLength = 0;
  pageSizeOptions = [10, 20, 50];

  filter = new BehaviorSubject<FilterOptions>({});

  isLoadingResults = true;
  isRateLimitReached = false;

  private router = inject(Router);
  private empoyeesService = inject(EmployeesService);

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.empoyeesService.getEmployees(
            this.filter.value,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
        }),
        map((result: { employees: Employee[], count: number }) => {
          this.isLoadingResults = false;
          this.employeesLength = result.count;
          return result.employees;
        })
      )
      .subscribe((employees: Employee[]) => this.employees = employees)
  }

  onViewEmployee(employeeId: string) {
    this.router.navigate(['dashboard', 'employees', employeeId]);
  }
  onEditEmployee(employeeId: string) {
    this.router.navigate(['dashboard', 'edit-employee', employeeId]);
  }

  onDeleteEmployee(employeeId: string) {
    confirm(`Are you sure deleted employee with id : ${employeeId}`)
  }
}
