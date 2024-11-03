import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response';
import { catchError, map, Observable, of } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { ApiErrorResponse } from '../interfaces/api-error-response';
import { FilterOptions } from '../interfaces/asset';

const BASE_URL: string = `http://localhost:8080/api/v1`;

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private http = inject(HttpClient);
  constructor() { }

  getEmployees(filter: FilterOptions = {}, sort?: string, page?: number, limit?: number):
    Observable<{ employees: Employee[], count: number }> {
    return this.http.get<ApiResponse>(`${BASE_URL}/users`)
      .pipe(
        catchError((errorResponse: ApiErrorResponse, caught) => this.handleError(errorResponse)),
        map((response: ApiResponse) => {
          const count: number = response?.data?.count;
          const employees: Employee[] = response.data?.users.map((user: any) => {
            const employee: Employee = {
              userId: user._id,
              username: user.username,
              usernumber: user.userNumber,
              firstname: 'f',
              lastname: 'l',
              email: user.email,
              role: user.role
            }
            return employee;
          })
          return { employees, count }
        })
      );
  }

  getEmployeeById(employeeId: string): Observable<Employee> {
    const url = `${BASE_URL}/users/${employeeId}`;
    return this.http.get<ApiResponse>(url)
      .pipe(
        map((result: ApiResponse) => {
          return result.data.user as Employee
        })
      );
  }

  editEmployee(employeeId: string, empData: Employee): Observable<ApiResponse | ApiErrorResponse> {
    const url = `${BASE_URL}/users/${employeeId}`;
    const body = empData;
    return this.http.put<ApiResponse | ApiErrorResponse>(url, body);
  }

  handleError(errorResponse: ApiErrorResponse) {
    console.log("errorResponse :", errorResponse);
    return of(errorResponse);
  }
}
