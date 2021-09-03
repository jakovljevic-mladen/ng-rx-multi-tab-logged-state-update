import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AllowedToEveryoneComponent } from './components/allowed-to-everyone/allowed-to-everyone.component';
import { RestrictedComponent } from './components/restricted/restricted.component';
import { ModalComponent } from './components/modal/modal.component';

import { AuthService } from './services/auth/auth.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    AllowedToEveryoneComponent,
    RestrictedComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
