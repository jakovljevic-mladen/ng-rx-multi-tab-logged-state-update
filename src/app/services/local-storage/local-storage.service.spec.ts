import { TestBed } from '@angular/core/testing';

import { TestScheduler } from 'rxjs/testing';

import { LocalStorageService, StateChange } from './local-storage.service';
import { User } from '../../models/user';

describe('LocalStorageService', () => {
  const adminUserData = '{"email":"admin@example.com","role":{"name":"ADMIN","permissions":[{"type": "ADMINISTRATION"}]}}';
  const regularUserData = '{"email":"regular@example.com","role":{"name":"REGULAR","permissions":[]}}';
  const badlyFormattedUserData = '{email: "email@example.com"}'; // bad JSON format
  const adminUser = <User>{
    email: 'admin@example.com',
    role: {
      name: 'ADMIN',
      permissions: [{ type: 'ADMINISTRATION' }]
    }
  };
  const regularUser = {
    email: 'regular@example.com',
    role: {
      name: 'REGULAR',
      permissions: []
    }
  };

  let service: LocalStorageService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filterNewUserDataChanges operator', () => {

    beforeEach(() => {
      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should only filter storage events with key "user"', () => {
      testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
        const storageEventValues = {
          a: <StorageEvent>{ key: 'user', newValue: null },
          b: <StorageEvent>{ key: 'welcomePopUp', newValue: 'true' },
          c: <StorageEvent>{ key: 'user', newValue: adminUserData },
          d: <StorageEvent>{ key: 'user', newValue: regularUserData },
          e: <StorageEvent>{ key: 'user', newValue: badlyFormattedUserData }
        };
        const e1 = hot('  --a--b--c-b---a---d----b-e-', storageEventValues);
        const expected = '--i-----j-----i---k------l-';
        const subs = '    ^--------------------------';

        const expectedValues = {
          i: null,
          j: adminUserData,
          k: regularUserData,
          l: badlyFormattedUserData
        };

        expectObservable(e1.pipe(service.filterNewUserDataChanges())).toBe(expected, expectedValues);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
  });

  describe('loggedStateChangesOperator operator', () => {

    beforeEach(() => {
      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should handle login', () => {
      testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
        const values = {
          b: adminUserData
        };
        const e1 = hot('  ----b----', values);
        const expected = '----j----';
        const subs = '    ^--------';

        const expectedValues = {
          j: <StateChange>{ state: 'loggedIn', user: adminUser }
        };

        expectObservable(e1.pipe(service.loggedStateChangesOperator())).toBe(expected, expectedValues);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });

    it('should handle logout', () => {
      testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
        const values = {
          a: adminUserData,
          b: null
        };
        const e1 = hot('  ----a--b-----------', values);
        const expected = '----i--j 4999ms k--';
        const subs = '    ^------------------';

        const expectedValues = {
          i: <StateChange>{ state: 'loggedIn', user: adminUser },
          j: <StateChange>{ state: 'loggedOut' },
          k: <StateChange>{ state: 'goToLogIn' }
        };

        expectObservable(e1.pipe(service.loggedStateChangesOperator())).toBe(expected, expectedValues);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });

    it('should handle logout and early login', () => {
      testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
        const values = {
          a: adminUserData,
          b: null,
          c: regularUserData
        };
        const e1 = hot('  ----a--b---- 2s ---c---', values);
        const expected = '----i--j---- 2s ---k---';
        const subs = '    ^----------- 2s -------';

        const expectedValues = {
          i: <StateChange>{ state: 'loggedIn', user: adminUser },
          j: <StateChange>{ state: 'loggedOut' },
          k: <StateChange>{ state: 'loggedIn', user: regularUser }
        };

        expectObservable(e1.pipe(service.loggedStateChangesOperator())).toBe(expected, expectedValues);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });

    it('should handle user data with bad format', () => {
      testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
        const values = {
          a: badlyFormattedUserData,
          b: null,
          c: adminUserData
        };
        const e1 = hot('  ----a----b-- 3s ---c----', values);
        const expected = '----i----j-- 3s ---k----';
        const subs = '    ^----------- 3s --------';

        const expectedValues = {
          i: <StateChange>{ state: 'errorParsingLocalStorage' },
          j: <StateChange>{ state: 'loggedOut' },
          k: <StateChange>{ state: 'loggedIn', user: adminUser }
        };

        expectObservable(e1.pipe(service.loggedStateChangesOperator())).toBe(expected, expectedValues);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
  });
});
