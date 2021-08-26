import { Component, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private destroy = new Subject<void>();

  showLogInModal: boolean;

  get loggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get hasPermissionForRestricted(): boolean {
    return this.authService.hasPermission('ADMINISTRATION');
  }

  get email() {
    return this.authService.getUserEmail();
  }

  constructor(
    private authService: AuthService
  ) {
    this.showLogInModal = false;
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  openLogInModal() {
    this.showLogInModal = true;
  }

  logInAdminUser() {
    this.authService.logInAdminUser()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.showLogInModal = false;
        }
      });
  }

  logInRegularUser() {
    this.authService.logInRegularUser()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.showLogInModal = false;
        }
      });
  }

  logOut() {
    this.authService.logOut()
      .pipe(takeUntil(this.destroy))
      .subscribe();
  }
}
