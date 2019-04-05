import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {
    MatSnackBar,
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material';

import { ForgetPasswordDialog } from './forget-password/forget-password.component';

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
        public dialog: MatDialog,
    ) {
        this.loginForm = new FormGroup({
            email: new FormControl({ value: '', disabled: this.loading }),
            password: new FormControl({ value: '', disabled: this.loading }),
        });
    }

    ngOnInit() {}
    ngOnDestroy() {}

    openDialog(): void {
        const dialogRef = this.dialog.open(ForgetPasswordDialog, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                try {
                    await this.authService.resetPassword(result);
                    this.snackBar.open(
                        'Password reset link has been sent to your email',
                        'dismiss',
                    );
                } catch {
                    this.snackBar.open(
                        'Error resetting password - try again',
                        'dismiss',
                    );
                }
            }
        });
    }

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
                'Dismiss',
            );
        } finally {
            this.loading = false;
        }
    }
}
