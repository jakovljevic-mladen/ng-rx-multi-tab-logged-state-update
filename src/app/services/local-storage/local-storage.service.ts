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

  localStorageEvents$: Observable<StorageEvent> = fromEvent<StorageEvent>(window, 'storage');

  userDataChanges$: Observable<string | null> = this.localStorageEvents$
    .pipe(
      filter((event: StorageEvent) => event.key === KEY_USER),
      map(({ newValue }) => newValue)
    );

  loggedStateChanges$: Observable<StateChange> = this.userDataChanges$
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

  constructor() {
  }
}
