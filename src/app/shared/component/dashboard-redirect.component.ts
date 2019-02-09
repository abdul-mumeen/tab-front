import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/index';

//@Component()
@Component({
    template: '',
})
export class DashboardRedirect implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        let navTo: string = '/login';
        let role: string = '';

        if (this.authService.user && this.authService.user.role) {
            role = this.authService.user.role;
        }

        switch (role.toLowerCase()) {
            case 'admin':
                navTo = '/admin';
                break;
            case 'user':
                navTo = '/user';
                break;
            default:
                navTo = '/login';
                break;
        }

        this.router.navigate([navTo]);
    }
}
