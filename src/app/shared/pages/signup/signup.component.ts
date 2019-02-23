import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
    signupForm: any;
    loading: boolean = false;

    constructor(
        private loc: Location,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
    ) {
        this.signupForm = new FormGroup({
            name: new FormControl({value: '', disabled: this.loading}),
            email: new FormControl({value: '', disabled: this.loading}),
            password: new FormControl({value: '', disabled: this.loading}),
        });
    }

    ngOnInit() {}
    ngOnDestroy() {}
    back() {
        this.loc.back();
    }

    async signup(signupForm: any) {
        this.loading = true;
        try {
            await this.authService.registerEmailUser(
                signupForm.name,
                signupForm.email,
                signupForm.password,
            );
            this.router.navigate(['/dashboard']);
        } catch (error) {
          this.snackBar.open(
            'Registration failed!',
            'Close'
          )
        } finally {
            this.loading = false;
        }
    }
}
