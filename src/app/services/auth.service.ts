import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, exhaustMap, flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    public apiUrl: string = environment.apiRoot;

    public user: any;
    public LoggedIn: any;
    private token: string;

    // this service is used everywhere and the constructor
    // gets called once when we first load/reload browser
    constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
        this.token = this.getToken();
        this.LoggedIn = new BehaviorSubject(null); // maintian LoggedIn info

        this.afAuth.user.subscribe(user => {
            this.user = user;
        });
    }

    registerEmailUser(email: string, password: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    public authHeaders() {
        // create authorization header with our jwt token
        if (this.token) {
            let headers = new HttpHeaders({
                Authorization: 'JWT ' + this.token,
                'Content-Type': 'application/json',
            });
            return headers;
        }
    }

    public authBlobDownloadHeaders() {
        if (this.token) {
            let headers = new HttpHeaders({
                Authorization: 'JWT ' + this.token,
                'Content-Type': 'application/json',
            });
            return headers;
        }
    }

    public authUploadHeaders() {
        if (this.token) {
            let headers = new HttpHeaders({
                Authorization: 'JWT ' + this.token,
                encrypt: 'multipart/form-data',
            });
            return headers;
        }
    }

    public contentHeader() {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return headers;
    }

    public checkUser() {
        // this is used in _guards to check if we have already got user info in session, if not it will load from firebase
        return of({ role: '' });
    }

    public resetUser() {
        // remove user from local storage to log me out
    }

    public logout() {}

    public loginEmailUser(email: string, password: string) {
        // authenticate then get user info then set it
    }

    public updateUser(meChanges: any) {}

    private loadUser() {
        // load user info
    }

    private authUser(email: string, password: string): Observable<any> {
        let headers = this.contentHeader();
        let data = JSON.stringify({ email: email, password: password });
        return this.http.post(this.apiUrl + '/login', data, {
            headers: headers,
        });
    }

    private getUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    }

    private storeUser(user: any) {
        this.user = user;
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    private getToken() {
        return localStorage.getItem('token') || null;
    }

    private storeToken(newToken: string) {
        this.token = newToken;
        localStorage.setItem('token', newToken);
    }
}
