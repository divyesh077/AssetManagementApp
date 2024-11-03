import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
import { ApiResponse } from '../../interfaces/api-response';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  signInForm!: FormGroup;
  isLogging: boolean = false;

  private fb = inject(FormBuilder);
  private authServices = inject(AuthService);
  private snackBarService = inject(SnackBarService);

  ngOnInit(): void {
    this.signInForm = this.createSignInForm();
  }
  createSignInForm() {
    return this.fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(15)])]
    })
  }

  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password')
  }
  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    }
    const { email, password } = this.signInForm.value;
    this.isLogging = false;
    this.authServices.login(email, password)
      .subscribe((response: ApiResponse) => {
        this.isLogging = false;
        this.snackBarService.openSuccessSnackBar(response.message || 'User loggedin successfuly')
      });
  }
}
