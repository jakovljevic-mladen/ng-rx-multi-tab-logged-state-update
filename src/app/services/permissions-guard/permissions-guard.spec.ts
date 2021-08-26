import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PermissionsGuard } from './permissions-guard';
import { AuthService } from '../auth/auth.service';

describe('PermissionsGuard', () => {
  let service: PermissionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionsGuard,
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['hasPermission']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });
    service = TestBed.inject(PermissionsGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
