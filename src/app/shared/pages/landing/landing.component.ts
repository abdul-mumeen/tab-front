import { Component, OnInit } from '@angular/core';
import { AuthService, DBService } from '../../../services/index';
import { MatSnackBar } from '@angular/material';

declare var tableau: any;

@Component({
    templateUrl: 'landing.component.html',
    styleUrls: ['landing.component.scss'],
})
export class LandingComponent implements OnInit {
    constructor(
      private authService: AuthService,
      private dbService: DBService,
      private snackBar: MatSnackBar
    ) {
        tableau.extensions.initializeAsync();
    }
    async ngOnInit() {
        try {
            const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
            const connectionSummaries = await datasources[0].getConnectionSummariesAsync();
            console.log(connectionSummaries);
            this.authService.updateConnectionDetails(connectionSummaries[0]);
            const tableSummaries = await datasources[0].getActiveTablesAsync();
            const tables = tableSummaries.map(summary => summary.name);
            this.dbService.updateTableauTables(tables);
        } catch {
            this.dbService.updateTableauTables([]);
        }
    }
}
