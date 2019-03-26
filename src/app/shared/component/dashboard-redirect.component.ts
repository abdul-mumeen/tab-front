import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/index';

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
        let navTo: string = '/landing';
        let role: string = '';
        if (this.authService.userDetails && this.authService.userDetails.role) {
            role = this.authService.userDetails.role;
        }

        switch (role.toLowerCase()) {
            case 'admin':
                navTo = '/admin';
                break;
            case 'user':
                navTo = '/tables';
                break;
            default:
                navTo = '/login';
                break;
        }

        this.router.navigate([navTo]);
    }
}
