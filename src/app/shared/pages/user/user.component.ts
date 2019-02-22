import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { TableSelect } from '../../../../models/models';

@Component({
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    tables: TableSelect[] = [];
    disableSelect: boolean = true;
    selectPlaceholder: string = 'No table available';

    constructor(
        private loc: Location,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.tables = [
            {
                displayName: 'chicken salad',
                value: 'chicken salad',
            },
            {
                displayName: 'pension',
                value: 'pension',
            },
        ];
        this.disableSelect = false;
        this.selectPlaceholder = !!this.tables
            ? 'Select table'
            : 'No table available';
    }
    ngOnDestroy() {}

    async goHome() {
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
