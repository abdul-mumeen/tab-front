import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.route'

import { AdminComponent } from './admin.component';

import { SharedComponentModule } from '../shared/component/shared-component.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedComponentModule,
    CommonModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }