import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: 'forget-password.component.html',
    styleUrls: ['forget-password.component.scss'],
})
export class ForgetPasswordDialog implements OnInit, OnDestroy {
    loginForm: any;
    loading: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ForgetPasswordDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit() {}
    ngOnDestroy() {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
