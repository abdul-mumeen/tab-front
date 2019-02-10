import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards/index';
import {
    LandingComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    DashboardRedirect,
} from './shared/index';

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardRedirect,
        canActivate: [AuthGuard],
    },
    { path: 'landing', component: LandingComponent },
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
