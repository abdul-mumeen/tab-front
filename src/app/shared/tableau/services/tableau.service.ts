import { Injectable } from '@angular/core';

declare const tableau: any;

@Injectable()
export class TableauService {
    dWorksheets: any;

    tab: any;

    dataSources: any[];

    constructor() {
        tableau.extensions.initializeAsync().then(() => {
            console.log('done tab init');
            console.log(tableau);
            this.tab = tableau;
            let dashboard = this.tab.extensions.dashboardContent.dashboard;

            let promises = [];

            dashboard.worksheets.forEach((worksheet) => {
                promises.push(worksheet.getDataSourcesAsync());
            });

            Promise.all(promises).then(result => {
                this.dataSources = result;
                console.log(result);
                result.forEach((source) => {
                    source.refreshAsync();
                })
            })
        });
    }

    refreshDataSources() {
        this.dataSources.forEach((source) => {
            console.log(source);
            let caught = source.refreshAsync();

            console.log(caught);
        })
    }
}

