import { Component, OnInit } from '@angular/core';
import { DBService } from '../../../services/db.service';
import { MatSnackBar } from '@angular/material';

declare var tableau: any;

@Component({
    templateUrl: 'landing.component.html',
    styleUrls: ['landing.component.scss'],
})
export class LandingComponent implements OnInit {
    constructor(private dbService: DBService, private snackBar: MatSnackBar) {
        tableau.extensions.initializeAsync();
    }
    async ngOnInit() {
        try {
            const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
            const tableSummaries = await datasources[0].getActiveTablesAsync();
            const tables = tableSummaries.map(summary => summary.name);
            this.dbService.updateTableauTables(tables);
        } catch {
            this.dbService.updateTableauTables([]);
        }
    }
}
