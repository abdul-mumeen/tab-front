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

    // this service is used everywhere and the constructor
    // gets called once when we first load/reload browser
    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afDb: AngularFirestore,
        private auth: AuthService
    ) {}

    getTables() {
      var url:string = this.auth.apiUrl + '/table';
      return this.http.get<any>(url);
    }

    async getTableMetaData(tableName: string) {
        return true;
    }

    createTables(tableData){
      var url:string = this.auth.apiUrl + '/table';
      return this.http.post(url, tableData);
    }
}
