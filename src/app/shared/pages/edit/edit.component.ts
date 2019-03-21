import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DBService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';

import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable-pro/angular';

declare var tableau: any;

@Component({
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    columns: Array<{}> = [];
    tableName: string;
    private hotRegisterer = new HotTableRegisterer();
    tableId = 'addInstance';
    tableSettings: Handsontable.GridSettings = {
        colWidths: 100,
        colHeaders: true,
    };
    columnHeaders: any[] = [];
    tableMetadata: any;
    error: boolean = false;

    dataset: any[] = [];

    constructor(
        private loc: Location,
        private dbService: DBService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private snackBar: MatSnackBar,
    ) {
        tableau.extensions.initializeAsync();
    }

    async ngOnInit() {
        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
        try {
            this.tableMetadata = await this.dbService.getTableInfo(
                this.tableName,
            );
        } catch {
            this.error = true;
        }
        this.columns = this.dbService.getCurrentTableDef();
        this.resetTableColumns(this.columns);
    }
    ngOnDestroy() {}

    resetTableColumns(columns) {
        const obj = {};
        this.dataset = [];

        columns.forEach(column => {
            if (column['name'] !== 'id') {
                obj[column['name']] = '';
                this.columnHeaders.push({
                    data: column['name'],
                    title: column['name'],
                });
            }
        });

        for (let i = 0; i < 5; i++) {
            const newObj = { ...obj };
            this.dataset.push(newObj);
        }
    }

    async submit() {
        const data = this.hotRegisterer.getInstance(this.tableId).getData();
        const columnHeaders = Object.keys(this.dataset[0]);
        let gg = [];
        data.forEach(da => {
            let row = [];

            da.forEach((d, i) => {
                let col = {};
                if (d === '') {
                    return;
                }
                col['columnName'] = columnHeaders[i];
                col['value'] = d;
                row.push(col);
            });
            if (row.length !== da.length) {
                return;
            }
            gg.push(row);
        });

        try {
            await this.dbService.addEntries({ rows: gg }).toPromise();
            const sOrNoS = gg.length > 1 ? 's have' : ' has';
            const message = `${
                gg.length
            } record${sOrNoS} been successfully added`;
            this.snackBar.open(message, 'dismiss', {
                duration: 5000,
                verticalPosition: 'top',
            });
            this.resetTableColumns(this.columns);
            const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
            datasources[0].refreshAsync();
        } catch (error) {
            this.snackBar.open(error, 'dismiss', {
                duration: 5000,
                verticalPosition: 'top',
            });
        }
    }

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

    back() {
        this.loc.back();
    }
}
