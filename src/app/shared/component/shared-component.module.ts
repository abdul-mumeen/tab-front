import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRedirect } from './dashboard-redirect.component';
import { LogoutComponent } from './logout.component';

@NgModule({
  imports: [
    CommonModule, FormsModule 
  ],
  declarations: [
    LogoutComponent, DashboardRedirect
  ],
  exports: [
    LogoutComponent, DashboardRedirect
  ]
})
export class SharedComponentModule { }
