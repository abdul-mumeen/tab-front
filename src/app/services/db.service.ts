import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, exhaustMap, flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
    private _connectionDetails = null;

    // this service is used everywhere and the constructor
    // gets called once when we first load/reload browser
    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afDb: AngularFirestore,
        private auth: AuthService,
    ) {}

    get tableauTables() {
        return this._tableauTables;
    }

    updateTableauTables(newtables) {
        this._tableauTables = newtables;
    }

    get connectionDetails() {
        return this._connectionDetails;
    }

    updateConnectionDetails(connectionDetails) {
        this._connectionDetails = connectionDetails;
    }

    getTables() {
        const url: string = this.auth.apiUrl + '/table';
        return this.http.get<any>(url);
    }

    async getTabless() {
        // Todo: handle errors
        const response = await this.http
            .get(`${this.apiUrl}/table`)
            .toPromise();
        this.tables = response['data']['tables'];
        const tableNames = this.tables.map(table => table['name']);
        return tableNames.filter(tableName =>
            this.tableauTables.includes(tableName),
        );
    }

    async getTableInfo(tableName: string) {
        // Todo: Handle errors
        try {
            const url: string = this.auth.apiUrl + `/table/${tableName}`;
            const response = await this.http.get<any>(url).toPromise();

            this.currentTableName = tableName;
            this.currentTableData = response.data['table']['rows'];
            this.currentTableDef = response.data['table']['columns'];
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    createTables(tableData) {
        const url: string = this.auth.apiUrl + '/table';
        return this.http.post(url, tableData);
    }

    connectToDatabase(connectionDetails) {
        const url: string = this.auth.apiUrl + '/connect';
        return this.http.post(url, connectionDetails);
    }

    addEntries(rowsData) {
        const url: string =
            this.auth.apiUrl + `/table/${this.currentTableName}/records`;
        return this.http.post(url, rowsData);
    }

    updateEntries(rowsData) {
        const url: string =
            this.auth.apiUrl + `/table/${this.currentTableName}/records`;
        return this.http.put(url, rowsData);
    }

    getCurrentTableDef(): Array<{}> {
        return this.currentTableDef;
    }

    getCurrentTableData() {
        return this.currentTableData;
    }
}
