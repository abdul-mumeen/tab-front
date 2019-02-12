import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: any;

    constructor(private loc: Location, private authService: AuthService) {
        this.loginForm = new FormGroup({
            email: new FormControl(),
            password: new FormControl(),
        });
    }

    ngOnInit() {}
    ngOnDestroy() {}
    back() {
        this.loc.back();
    }

    signup(loginForm: any) {
        console.log(loginForm, 'details');
        this.authService.loginEmailUser(loginForm.email, loginForm.password);
    }
}
