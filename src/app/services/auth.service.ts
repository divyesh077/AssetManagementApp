import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response';
import { ApiErrorResponse } from '../interfaces/api-error-response';
import { BehaviorSubject, catchError, take, tap, throwError } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { response } from 'express';
import { json } from 'stream/consumers';

const BASE_URL = 'http://localhost:8080/api/v1/auth';
const USER = 'user';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshTOken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuth = new BehaviorSubject<boolean>(false);
  private accessToken: string | null = null;

  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);

  constructor() { }

  isAuthenticated() {
    return this.isAuth;
  }

  getAuthToken() {
    const accessToken = this.accessToken;
    return accessToken;
  }

  register(username: string, usernumber: string, email: string, password: string) {
    const url = `${BASE_URL}/register`;
    const body = {
      username,
      usernumber,
      email,
      password
    };
    return this.http.post<ApiResponse>(url, body)
  }

  login(email: string, password: string) {
    const url = `${BASE_URL}/login`;
    const body = {
      email: email,
      password: password
    }
    const options = {};
    return this.http.post<ApiResponse>(url, body, options)
      .pipe(
        take(1),
        tap((response: ApiResponse) => {
          this.accessToken = response.data?.tokensData.accessToken;
          this.isAuth.next(true);
          this.router.navigate(['dashboard']);
          this.setUser(response.data?.user)
          this.setAuthTokens(response.data?.tokensData);
        })
      )
  }

  logout() {
    const url = `${BASE_URL}/logout`;
    const body = {}
    const options = {};
    this.http.post<ApiResponse>(url, body, options)
      .subscribe((response: ApiResponse) => {
        this.isAuth.next(false);
        this.removeUser();
        this.removeAuthTokens();
      });
  }

  autoLogin() {
    const url = `${BASE_URL}/refresh-tokens`;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const body = {
      refreshToken: refreshToken
    }
    const options = {};
    return this.http.post<ApiResponse>(url, body, options)
      .pipe(
        tap((response: ApiResponse) => {
          if (response.data) {
            this.isAuth.next(true);
            this.setUser(response.data?.user);
            this.setAuthTokens(response.data?.tokensData)
          }
        }),
        catchError((err: ApiErrorResponse) => throwError(err))
      );
  }

  private setUser(user: Employee) {
    localStorage.setItem(USER, JSON.stringify(user));
  }
  private setAuthTokens(tokensData: any) {
    const { accessToken, refreshToken } = tokensData;
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }
  private removeUser() {
    localStorage.removeItem('user');
  }
  private removeAuthTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN)
  }
}
