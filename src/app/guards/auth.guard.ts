import { Injectable } from '@angular/core';
import { concatMap, take } from 'rxjs/operators';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../services/index';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

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
            return Promise.resolve(true);
        } else {
            this.router.navigate(['/landing'], {
                queryParams: { returnUrl: state.url },
            });
            return Promise.resolve(false);
        }
    }
}
