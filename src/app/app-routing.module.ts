import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AllowedToEveryoneComponent } from './components/allowed-to-everyone/allowed-to-everyone.component';
import { RestrictedComponent } from './components/restricted/restricted.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionsGuard } from './services/permissions-guard/permissions-guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'allowed',
    component: AllowedToEveryoneComponent
  },
  {
    path: 'restricted',
    component: RestrictedComponent,
    canActivate: [PermissionsGuard],
    data: {
      permission: 'ADMINISTRATION'
    }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PermissionsGuard]
})
export class AppRoutingModule {
}
