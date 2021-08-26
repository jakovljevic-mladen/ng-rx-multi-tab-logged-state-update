import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, delay, tap, timer } from 'rxjs';

import { User, getAdminUser, getRegularUser } from '../../models/user';

export const KEY_USER = 'user';

@Injectable()
export class AuthService {

  user: User | null;

  constructor(
    private router: Router
  ) {
    try {
      const lsUser = localStorage.getItem(KEY_USER);

      this.user = lsUser ? JSON.parse(lsUser) : null;
    } catch {
      this.user = null;
    }
  }

  hasPermission(permissionType: string): boolean {
    return !!this.user?.role.permissions.find(({ type }) => type === permissionType);
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  getUserEmail(): string {
    return this.user!.email;
  }

  logInAdminUser(): Observable<User> {
    return of(getAdminUser())
      .pipe(
        delay(200),
        tap({
          next: user => {
            this.user = user;
            localStorage.setItem(KEY_USER, JSON.stringify(user));
          }
        })
      );
  }

  logInRegularUser(): Observable<User> {
    return of(getRegularUser())
      .pipe(
        delay(200),
        tap({
          next: user => {
            this.user = user;
            localStorage.setItem(KEY_USER, JSON.stringify(user));
          }
        })
      );
  }

  logOut(): Observable<unknown> {
    return timer(200).pipe(
      tap({
        next: () => {
          this.user = null;
          localStorage.removeItem(KEY_USER);
          return this.router.navigate(['/']);
        }
      })
    );
  }
}
