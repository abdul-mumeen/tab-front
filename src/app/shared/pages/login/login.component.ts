import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: any;
    loading: boolean = false;

    constructor(
        private loc: Location,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private router: Router,
    ) {
        this.loginForm = new FormGroup({
            email: new FormControl({value: '', disabled: this.loading}),
            password: new FormControl({value: '', disabled: this.loading}),
        });
    }

    ngOnInit() {}
    ngOnDestroy() {}
    back() {
        this.loc.back();
    }

    async login(loginForm: any) {
        this.loading = true;
        try {
            await this.authService.loginEmailUser(
                loginForm.email,
                loginForm.password,
            );
            this.router.navigate(['/dashboard']);
        } catch {
          this.snackBar.open(
            'Unable to verify email and password combination',
            'Close'
          )
        } finally {
            this.loading = false;
        }
    }
}
