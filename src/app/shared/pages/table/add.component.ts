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
    tableName: string;
    private hotRegisterer = new HotTableRegisterer();
    tableId = 'addInstance';
    tableSettings: Handsontable.GridSettings = {
        colWidths: 100,
        colHeaders: true,
    };

    // dataset: any[] = [
    //     { id: 1, name: 'Ted Right', address: 'Wall Street' },
    //     { id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue' },
    //     { id: 3, name: 'Joan Well', address: 'Broadway' },
    //     { id: 4, name: 'Gail Polite', address: 'Bourbon Street' },
    //     { id: 5, name: 'Michael Fair', address: 'Lombard Street' },
    //     { id: 6, name: 'Mia Fair', address: 'Rodeo Drive' },
    //     { id: 7, name: 'Cora Fair', address: 'Sunset Boulevard' },
    //     { id: 8, name: 'Jack Right', address: 'Michigan Avenue' },
    // ];

    dataset: any[] = [
        { id: '', Yo: '', me: '' },
        { id: '', name: '', address: '' },
        { id: '', name: '', address: '' },
    ];

    constructor(
        private loc: Location,
        private dbService: DBService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) {}

    async ngOnInit() {
        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
    }
    ngOnDestroy() {}

    submit() {
        const data = this.hotRegisterer.getInstance(this.tableId).getData();
        console.log(data, 'data');
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
