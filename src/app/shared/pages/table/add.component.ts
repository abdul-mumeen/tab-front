import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DBService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';

import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable-pro/angular';

@Component({
    templateUrl: 'add.component.html',
    styleUrls: ['table.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
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

    dataset: any[] = [];

    constructor(
        private loc: Location,
        private dbService: DBService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) {
        this.columns = this.dbService.getCurrentTableDef();
        const obj = {};

        this.columns.forEach(column => {
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

    async ngOnInit() {
        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
    }
    ngOnDestroy() {}

    async submit() {
        const data = this.hotRegisterer.getInstance(this.tableId).getData();
        console.log(data, 'data');
        let gg = [];
        data.forEach(da => {
            let row = [];

            da.forEach((d, i) => {
                let col = {};
                if (d === '') {
                    return;
                }
                col['columnName'] = this.columns[i + 1]['name'];
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
            console.log('Records successfully added');
        } catch (error) {
            console.log(error);
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
