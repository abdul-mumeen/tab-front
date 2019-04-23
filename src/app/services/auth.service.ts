import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {
    map,
    catchError,
    exhaustMap,
    flatMap,
    switchMap,
} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserModel } from '../../models/models';

declare var tableau: any;

@Injectable()
export class AuthService {
    public apiUrl: string = environment.apiRoot;
    private _connectionDetails = null;

    public user: BehaviorSubject<UserModel> = new BehaviorSubject(null);
    private token: string;

    // this service is used everywhere and the constructor
    // gets called once when we first load/reload browser
    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afDb: AngularFirestore,
    ) {
        tableau.extensions.initializeAsync().then(async () => {
            const datasources = await tableau.extensions.dashboardContent.dashboard.worksheets[0].getDataSourcesAsync();
            const connectionSummaries = await datasources[0].getConnectionSummariesAsync();
            this.updateConnectionDetails(connectionSummaries[0]);
        });

        this.token = this.getToken();

        this.afAuth.user
            .pipe(
                map(async user => {
                    if (user) {
                        const userDocRef = await this.getDoc(
                            `users/${user.uid}`,
                        );
                        const userDoc = userDocRef.data();
                        if (userDoc) {
                            return {
                                ...user,
                                role: userDoc.role || '',
                                name: userDoc.name || '',
                            };
                        }
                        return user;
                    } else {
                        return null;
                    }
                }),
            )
            .subscribe(async response => {
                const user = await response;
                this.user.next(user);
            });
    }

    get connectionDetails() {
        return this._connectionDetails;
    }

    updateConnectionDetails(connectionDetails) {
        this._connectionDetails = connectionDetails;
    }

    async registerEmailUser(name: string, email: string, password: string) {
        try {
            const userCred = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password);
            this.updateUser({
                ...userCred.user,
                role: 'user',
                name: name,
            });
            await this.setDoc(`users/${this.userDetails.uid}`, {
                name,
                email,
                role: 'user',
            });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public authHeaders() {
        // create authorization header with our jwt token
        if (this.token) {
            let connectionId = this.connectionDetails.id;
            let isAdmin = this.userDetails.role == 'admin' ? true : false;
            let headers = new HttpHeaders({
                Authorization: this.token,
                'connection-id': connectionId,
                admin: isAdmin ? 'true' : 'false',
                'Content-Type': 'application/json',
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

    public checkUser(): Observable<any> {
        // this is used in _guards to check if we have already got user info in session, if not it will load from firebase
        return this.afAuth.user;
    }

    public resetUser() {
        // remove user from local storage to log me out
    }

    public logout() {
        sessionStorage.removeItem('token');
        return this.afAuth.auth.signOut();
    }

    get userDetails() {
        return this.user.value;
    }

    async loginEmailUser(email: string, password: string) {
        try {
            const userCred = await firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
            this.getAPItoken(userCred.user.uid).subscribe(
                (tokenResponse: any) => {
                    this.storeToken(tokenResponse.data.token);
                    return null;
                },
            );
            const userDocRef = await this.getDoc(`users/${userCred.user.uid}`);
            const userDoc = userDocRef.data();
            this.updateUser({
                ...userCred.user,
                role: userDoc.role || '',
                name: userDoc.name || '',
            });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public updateUser(user: UserModel) {
        this.user.next(user);
    }

    private getToken() {
        return sessionStorage.getItem('token') || null;
    }

    private getAPItoken(uuid: string) {
        let headers = this.contentHeader();
        let data = { uuid: uuid };
        return this.http.post(this.apiUrl + '/auth/authenticate', data, {
            headers: headers,
        });
    }

    private storeToken(newToken: string) {
        this.token = newToken;
        sessionStorage.setItem('token', newToken);
    }

    setDoc(docPath, data = {}, options = {}): Promise<void> {
        return this.afDb.doc(docPath).set(data, options);
    }

    getDoc(path) {
        return this.afDb.firestore.doc(path).get();
    }

    resetPassword(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }
}
