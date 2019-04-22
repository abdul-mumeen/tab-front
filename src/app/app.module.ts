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
import { HotTableModule } from '@handsontable/angular';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';

import { InterceptService, AuthService, DBService } from './services/index';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import {
    SharedComponentModule,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    EditComponent,
    TablesComponent,
    ForgetPasswordDialog,
} from './shared/index';

import { AuthGuard, AdminGuard } from './guards/index';

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        LoginComponent,
        SignupComponent,
        EditComponent,
        TablesComponent,
        ForgetPasswordDialog,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatSnackBarModule,
        MatPaginatorModule,
        routes,
        SharedComponentModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatDialogModule,
        MatSelectModule,
        HotTableModule.forRoot(),
    ],
    providers: [
        AuthGuard,
        AdminGuard,
        AuthService,
        DBService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        // { provide: Window, useValue: window },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                duration: 5000,
                panelClass: 'snackBarLength',
                verticalPosition: 'top',
            },
        },
    ],
    bootstrap: [AppComponent],
    entryComponents: [ForgetPasswordDialog],
})
export class AppModule {}
