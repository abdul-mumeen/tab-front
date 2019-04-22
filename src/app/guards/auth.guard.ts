import { Injectable } from '@angular/core';
import { concatMap, take } from 'rxjs/operators';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

import { AuthService, DBService } from '../services/index';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private dbService: DBService,
        private snackBar: MatSnackBar,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService
            .checkUser()
            .pipe(
                take(1),
                concatMap(user => this.isLoggedIn(user, state)),
            )
            .toPromise();
    }

    isLoggedIn(user, state) {
        if (user) {
            if (this.authService.connectionDetails) {
                return Promise.resolve(true);
            } else {
                this.snackBar.open(
                    'No database connection for tableau. Connect to a database on tableau and try again',
                );
                this.router.navigate(['/landing'], {
                    queryParams: { returnUrl: state.url },
                });
                return Promise.resolve(false);
            }
        } else {
            this.router.navigate(['/landing'], {
                queryParams: { returnUrl: state.url },
            });
            return Promise.resolve(false);
        }
    }
}
