import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.route';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { HotTableModule } from '@handsontable-pro/angular';

import { InterceptService, AuthService, DBService } from './services/index';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import {
    SharedComponentModule,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    UserComponent,
    TableComponent,
    AddComponent,
} from './shared/index';

import { AuthGuard, AdminGuard } from './guards/index';

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        LoginComponent,
        SignupComponent,
        UserComponent,
        TableComponent,
        AddComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatSnackBarModule,
        routes,
        SharedComponentModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatSelectModule,
        HotTableModule,
    ],
    providers: [
        AuthGuard,
        AdminGuard,
        AuthService,
        DBService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
        // { provide: Window, useValue: window },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: { duration: 3000, panelClass: 'snackBarLength' },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
