import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {MatIconModule} from '@angular/material/icon';
import { DashboardRedirect } from './dashboard-redirect.component';
import { LogoutComponent } from './logout.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule, FormsModule,
    MatIconModule,
  ],
  declarations: [
    LogoutComponent, DashboardRedirect,
    FooterComponent, HeaderComponent
  ],
  exports: [
    LogoutComponent, DashboardRedirect, FooterComponent,
    MatIconModule, HeaderComponent
  ]
})
export class SharedComponentModule { }
