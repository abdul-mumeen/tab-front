import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.route';
import { MatButtonModule } from '@angular/material/button';

import { InterceptService, AuthService } from './services/index';

import { AppComponent } from './app.component';

import {
    SharedComponentModule,
    LandingComponent,
    LoginComponent,
    SignupComponent,
} from './shared/index';

import { AuthGuard, AdminGuard } from './guards/index';

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        routes,
        SharedComponentModule,
    ],
    providers: [
        AuthGuard,
        AdminGuard,
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
        { provide: Window, useValue: window },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
