import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';

import { Subject, takeUntil, combineLatest, filter } from 'rxjs';

import { AuthService, KEY_USER } from './services/auth/auth.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();

  showLoggedOutModal: boolean;
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
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.showLoggedOutModal = false;
    this.showLogInModal = false;
  }

  ngOnInit() {
    this.localStorageService.loggedStateChanges$
      .pipe(takeUntil(this.destroy))
      .subscribe(change => {
        switch (change.state) {
          case 'loggedIn':
            this.authService.user = change.user!;
            this.showLoggedOutModal = false;
            this.showLogInModal = false;
            break;
          case 'loggedOut':
            this.authService.user = null;
            this.showLoggedOutModal = true;
            break;
          case 'goToLogIn':
            if (this.showLoggedOutModal) {
              this.showLoggedOutModal = false;
              this.showLogInModal = true;
            }
            break;
          case 'errorParsingLocalStorage':
            if (this.authService.user) {
              localStorage.setItem(KEY_USER, JSON.stringify(this.authService.user));
            } else {
              localStorage.removeItem(KEY_USER);
            }
            break;
        }
      });

    combineLatest([
      this.router.events.pipe(filter(value => value instanceof ActivationEnd)),
      this.localStorageService.loggedStateChanges$
    ]).pipe(takeUntil(this.destroy))
      .subscribe(([activationEnd, change]) => {
        const permission = (<ActivationEnd>activationEnd).snapshot.data.permission;

        if (permission && change.state === 'loggedOut') {
          this.router.navigate(['/']);
        }
      });
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
