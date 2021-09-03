import { TestBed } from '@angular/core/testing';

import { TestScheduler } from 'rxjs/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  const adminUser = '{"email":"admin@example.com","role":{"name":"ADMIN","permissions":[{"type": "ADMINISTRATION"}]}}';
  const regularUser = '{"email":"regular@example.com","role":{"name":"REGULAR","permissions":[]}}';

  const storageEventValues = {
    a: <StorageEvent>{ key: 'user', newValue: null },
    b: <StorageEvent>{ key: 'welcomePopUp', newValue: 'true' },
    c: <StorageEvent>{ key: 'user', newValue: adminUser },
    d: <StorageEvent>{ key: 'user', newValue: regularUser },
    e: <StorageEvent>{ key: 'user', newValue: regularUser.slice(0, 1) }
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
        const e1 = hot('  --a--b--c-b---a---d----b-e-', storageEventValues);
        const expected = '--i-----j-----i---k------l-';
        const subs = '    ^--------------------------';

        const expectedValues = {
          i: null,
          j: adminUser,
          k: regularUser,
          l: regularUser.slice(0, 1)
        };

        expectObservable(e1.pipe(service.filterNewUserDataChanges())).toBe(expected, expectedValues);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
  });
});
