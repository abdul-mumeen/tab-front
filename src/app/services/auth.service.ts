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

@Injectable()
export class AuthService {
    public apiUrl: string = environment.apiRoot;

    public user: BehaviorSubject<UserModel> = new BehaviorSubject(null);
    public LoggedIn: any;
    private token: string;

    // this service is used everywhere and the constructor
    // gets called once when we first load/reload browser
    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afDb: AngularFirestore,
    ) {
        // this.token = this.getToken();
        this.LoggedIn = new BehaviorSubject(null); // maintian LoggedIn info

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

    public checkUser(): Observable<any> {
        // this is used in _guards to check if we have already got user info in session, if not it will load from firebase
        return this.afAuth.user;
    }

    public resetUser() {
        // remove user from local storage to log me out
    }

    public logout() {
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

    // private getToken() {
    //     return localStorage.getItem('token') || null;
    // }

    // private storeToken(newToken: string) {
    //     this.token = newToken;
    //     localStorage.setItem('token', newToken);
    // }

    setDoc(docPath, data = {}, options = {}): Promise<void> {
        return this.afDb.doc(docPath).set(data, options);
    }

    getDoc(path) {
        return this.afDb.firestore.doc(path).get();
    }
}
