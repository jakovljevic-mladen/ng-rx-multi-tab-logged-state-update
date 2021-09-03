import { Injectable } from '@angular/core';

import { fromEvent, Observable, filter, map, switchMap, timer, mapTo, concat } from 'rxjs';

import { KEY_USER } from '../auth/auth.service';
import { User } from '../../models/user';

export interface StateChange {
  state: StateChanges;
  user?: User;
}

export type StateChanges = 'loggedIn' | 'loggedOut' | 'goToLogIn' | 'errorParsingLocalStorage';

export const GO_TO_LOGIN_AFTER_MS = 5_000; // 5 seconds

@Injectable()
export class LocalStorageService {
  private _localStorageEvents$: Observable<StorageEvent> = fromEvent<StorageEvent>(window, 'storage');
  private _userDataChanges$?: Observable<string | null>;
  private _loggedStateChanges$?: Observable<StateChange>;

  constructor() {
  }

  get localStorageEvents$(): Observable<StorageEvent> {
    return this._localStorageEvents$;
  }

  get userDataChanges$(): Observable<string | null> {
    if (!this._userDataChanges$) {
      this._userDataChanges$ = this.localStorageEvents$
        .pipe(
          filter(({ key }) => key === KEY_USER),
          map(({ newValue }) => newValue)
        );
    }

    return this._userDataChanges$;
  }

  get loggedStateChanges$(): Observable<StateChange> {
    if (!this._loggedStateChanges$) {
      this._loggedStateChanges$ = this.userDataChanges$
        .pipe(
          switchMap(newLocalStorageValue => {
            if (newLocalStorageValue == null || newLocalStorageValue === '') {
              return concat(
                [<StateChange>{ state: 'loggedOut' }],
                timer(GO_TO_LOGIN_AFTER_MS)
                  .pipe(
                    mapTo(<StateChange>{ state: 'goToLogIn' })
                  )
              );
            } else {
              try {
                const user = JSON.parse(newLocalStorageValue);
                return [<StateChange>{ state: 'loggedIn', user }];
              } catch (error) {
                return [<StateChange>{ state: 'errorParsingLocalStorage' }];
              }
            }
          })
        );
    }

    return this._loggedStateChanges$;
  }
}
