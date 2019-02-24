import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DBService } from '../../../services/db.service';

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
    loadingTables: boolean = false;

    constructor(
        private loc: Location,
        private authService: AuthService,
        private dbService: DBService,
        private router: Router,
    ) {}

    async ngOnInit() {
        this.loading = true;
        // this.tables = await this.dbService.getTables().toPromise();
        // if (!!this.tables) {
        const tables = await this.dbService.getTabless();
        if (!!tables) {
            // this.tables = tables.map(table => {
            //     return {
            //         displayName: table,
            //         value: table,
            //     };
            // });
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
            this.selectPlaceholder = 'Connect to tables';
        } else {
            this.disableSelect = true;
            this.selectPlaceholder = 'No table available';
        }
        this.loading = false;
    }
    ngOnDestroy() {}

    handleChange(event) {
        const table = event.value;
        this.router.navigate([`tables/${table}`]);
    }

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
