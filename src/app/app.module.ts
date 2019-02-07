import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableauModule } from './shared/tableau/tableau.module';

import { AppComponent } from './app.component';
import { RootModule, rootRoute } from './root/root.module';


const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            rootRoute,
        ]
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        RouterModule.forRoot(routes),
        RootModule,
        TableauModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
