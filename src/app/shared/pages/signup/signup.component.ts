import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
    signupForm: any;
    loading: boolean = false;

    constructor(private loc: Location, private authService: AuthService) {
        this.signupForm = new FormGroup({
            name: new FormControl(),
            email: new FormControl(),
            password: new FormControl(),
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
                signupForm.email,
                signupForm.password,
            );
        } catch (error) {
        } finally {
            this.loading = false;
        }
    }
}
