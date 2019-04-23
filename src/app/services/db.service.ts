import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, exhaustMap, flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare var tableau: any;

@Injectable()
export class DBService {
    public apiUrl: string = environment.apiRoot;

    public user: any;
    public LoggedIn: any;
    private token: string;
    private tables: string[] = [];
    private currentTableData: any = null;
    private currentTableName: string = '';
    private currentTableDef: any = null;

    private _tableauTables = [];

    // this service is used everywhere and the constructor
    // gets called once when we first load/reload browser
    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afDb: AngularFirestore,
        private auth: AuthService,
    ) {
        tableau.extensions.initializeAsync().then(async () => {
            const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
            const tableSummaries = await datasources[0].getActiveTablesAsync();
            const tables = tableSummaries.map(summary => summary.name);
            this.updateTableauTables(tables);
        });
    }

    get tableauTables() {
        return this._tableauTables;
    }

    updateTableauTables(newtables) {
        this._tableauTables = newtables;
    }

    getTables() {
        const url: string = this.auth.apiUrl + '/table';
        const headers = this.auth.authHeaders();
        console.log(headers, 'headdrs');

        return this.http.get<any>(url, { headers: headers });
    }

    async getTabless() {
        // Todo: handle errors
        const headers = this.auth.authHeaders();
        const response = await this.http
            .get(`${this.apiUrl}/table`, { headers: headers })
            .toPromise();
        this.tables = response['data']['tables'];
        const tableNames = this.tables.map(table => table['name']);
        return tableNames.filter(tableName =>
            this.tableauTables.includes(tableName),
        );
    }

    async getTableInfo(
        tableName: string,
        perPage: number = 10,
        page: number = 0,
    ) {
        const headers = this.auth.authHeaders();
        // Todo: Handle errors
        try {
            const url: string =
                this.auth.apiUrl +
                `/table/${tableName}?limit=${perPage}&page=${page}`;
            const response = await this.http
                .get<any>(url, { headers: headers })
                .toPromise();

            this.currentTableName = tableName;
            this.currentTableData = response.data['table']['rows'];
            this.currentTableDef = response.data['table']['columns'];
            return Promise.resolve(response.data['table']['total']);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    createTables(tableData) {
        const headers = this.auth.authHeaders();
        const url: string = this.auth.apiUrl + '/table';
        return this.http.post(url, tableData, { headers: headers });
    }

    connectToDatabase(connectionDetails) {
        const headers = this.auth.authHeaders();
        const url: string = this.auth.apiUrl + '/connect';
        return this.http.post(url, connectionDetails, { headers: headers });
    }

    addEntries(rowsData) {
        const headers = this.auth.authHeaders();
        const url: string =
            this.auth.apiUrl + `/table/${this.currentTableName}/records`;
        return this.http.post(url, rowsData, { headers: headers });
    }

    updateEntries(rowsData) {
        const headers = this.auth.authHeaders();
        const url: string =
            this.auth.apiUrl + `/table/${this.currentTableName}/records`;
        return this.http.put(url, rowsData, { headers: headers });
    }

    getCurrentTableDef(): Array<{}> {
        return this.currentTableDef;
    }

    getCurrentTableData() {
        return this.currentTableData;
    }
}
