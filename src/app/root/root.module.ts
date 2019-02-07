import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';

import { MaterialModule } from '../shared/material.module';
import { AdminComponent } from './admin/admin.component';
import { FormComponent } from './form/form.component';
import { RootComponent } from './root.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SideNavRecursComponent } from './components/side-nav/side-nav-recurs.component';


export const rootRoute: Route = {
    path: '',
    component: RootComponent,
    children: [
        { path: '', pathMatch: 'full', redirectTo: '/admin' },
        {
            path: 'admin',
            component: AdminComponent,
        },
        {
            path: 'form',
            component: FormComponent,
        },
    ],
};

@NgModule({
    declarations: [
        AdminComponent,
        FormComponent,
        RootComponent,
        SideNavComponent,
        SideNavRecursComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterModule,
    ],
})
export class RootModule {
}
