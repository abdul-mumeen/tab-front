import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    constructor(
        private loc: Location,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {}
    ngOnDestroy() {}

    async logout() {
        this.loading = true;
        try {
            await this.authService.logout();
            this.router.navigate(['/landing']);
        } catch {
        } finally {
            this.loading = false;
        }
    }
}
