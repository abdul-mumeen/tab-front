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
export class AdminGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // check role
        return this.authService
            .checkUser()
            .pipe(
                take(1),
                concatMap(user => this.isAdmin(user)),
            )
            .toPromise();
    }

    async isAdmin(user) {
        if (user) {
            const userDocRef = await this.authService.getDoc(
                `users/${user.uid}`,
            );
            const userDoc = userDocRef.data();
            if (userDoc.role === 'admin') {
                return true;
            } else {
                this.router.navigate(['/tables']);
                return false;
            }
        }
        this.router.navigate(['/login']);
        return false;
    }
}
