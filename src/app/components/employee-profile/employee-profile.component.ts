import { Component, inject, OnInit } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit {
  avtar: string | null = null;

  private authService = inject(AuthService);
  ngOnInit(): void {
    // this.authService.isUserLoggedIn()
    //   .subscribe((isLoggedIn: boolean) => {
    //     const user = localStorage.getItem('user');
    //     if (isLoggedIn && user) {
    //       const loggedInUser = JSON.parse(user);
    //       this.avtar = loggedInUser.avtar || null
    //     }
    //   })
  }
}
