import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
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
        return this.authService.checkUser().pipe(
            map(result => {
                console.log(result, 'results');
                if (result) {
                    console.log(result, 'true');
                    return true;
                } else {
                    console.log(result, 'false');
                    this.router.navigate(['/landing'], {
                        queryParams: { returnUrl: state.url },
                    });
                    return false;
                }
            }),
        );
    }
}
