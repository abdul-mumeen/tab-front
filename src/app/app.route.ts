import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards/index';
import {
    LandingComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    DashboardRedirect,
    UserComponent,
    TablesComponent,
} from './shared/index';

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardRedirect,
        canActivate: [AuthGuard],
    },
    {
        path: 'tables',
        component: TablesComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'tables/:name',
        component: TablesComponent,
        canActivate: [AuthGuard],
    },
    { path: 'landing', component: LandingComponent },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule',
        canActivate: [AdminGuard],
    },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'signup', component: SignupComponent },
    // otherwise redirect to dashboard (which will kick to login if necessary)
    { path: '**', redirectTo: 'dashboard' },
];

export const routes = RouterModule.forRoot(appRoutes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
});
