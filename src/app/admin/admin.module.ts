import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin.route'

import { AdminComponent } from './admin.component';
import { CreateTables } from './create-table.component';

import { SharedComponentModule } from '../shared/component/shared-component.module';

@NgModule({
  imports: [
    AdminRoutingModule, FormsModule,
    SharedComponentModule, ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    AdminComponent, CreateTables
  ]
})
export class AdminModule { }