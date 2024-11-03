import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavLink } from '../../interfaces/nav-link';
import { MatCardModule } from '@angular/material/card';
import { EmployeeProfileComponent } from '../../components/employee-profile/employee-profile.component';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    EmployeeProfileComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatDivider
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  navLinks: NavLink[] = [
    {
      id: '1',
      text: 'Dashboard',
      link: 'home',
      icon: 'dashboard'
    },
    {
      id: '2',
      text: 'Employees',
      link: 'employees',
      icon: 'group'
    },
    {
      id: '3',
      text: 'Assets',
      link: 'assets',
      icon: 'devices'
    },
    {
      id: '4',
      text: 'Add New Asset',
      link: 'add-asset',
      icon: 'person'
    },
    {
      id: '50',
      text: 'Setting',
      link: 'setting',
      icon: 'settings'
    },
    {
      id: '51',
      text: 'Logout',
      link: 'logout',
      icon: 'logout'
    },
  ];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
