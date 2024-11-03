import { Component, inject } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm!: FormGroup;
  isCreating: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authServices = inject(AuthService);
  private snackBarService = inject(SnackBarService);

  ngOnInit(): void {
    this.signUpForm = this.createSignInForm();
  }
  createSignInForm() {
    return this.fb.group({
      'username': [null, Validators.required],
      'usernumber': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(15)])]
    })
  }

  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password')
  }
  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }
    const { username, usernumber, email, password } = this.signUpForm.value;
    this.isCreating = true;
    this.authServices.register(username, usernumber, email, password)
      .subscribe({
        next: (response: ApiResponse) => {
          this.isCreating = false;
          this.snackBarService.openSuccessSnackBar(response.message || 'User created successfuly');
          this.router.navigate(['dashboard', 'assets'])
        },
        error: () => this.isCreating = false
      });
  }
}
