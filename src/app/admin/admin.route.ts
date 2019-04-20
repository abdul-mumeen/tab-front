import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { CreateTables } from './create-table.component';
import { ConnectSqlComponent } from './connect-sql.component';

const appRoutes: Routes = [
    { path: '', component: AdminComponent },
    { path: 'table/new', component: CreateTables },
    { path: 'connect_sql', component: ConnectSqlComponent },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
