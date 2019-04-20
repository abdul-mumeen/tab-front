import {
    Component,
    Input,
    HostListener,
    OnInit,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DBService } from '../services/db.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

declare var tableau: any;

@Component({
    templateUrl: 'connect-sql.component.html',
    styleUrls: ['connect-sql.component.scss'],
})
export class ConnectSqlComponent implements OnInit {
    tableForm: FormGroup;
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private db: DBService,
        private snackBar: MatSnackBar,
    ) {
        tableau.extensions.initializeAsync();
        this.tableForm = new FormGroup({
            server: new FormControl('', Validators.required),
            port: new FormControl('', Validators.required),
            database: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {}

    async connectToDatabase() {
        this.loading = true;
        if (this.tableForm.valid) {
            let valuesObject = this.tableForm.getRawValue();
            const connectionDetails = this.db.connectionDetails;

            if (
                !connectionDetails ||
                connectionDetails.name !== valuesObject.server
            ) {
                this.snackBar.open(
                    'The database connected to in tableau must match the one here. Kindly verify and try again',
                    'dismiss',
                );
            }

            try {
                this.db.connectToDatabase({
                    ...connectionDetails,
                    ...valuesObject,
                });
            } catch {}
            this.loading = false;
        } else {
            this.snackBar.open(
                'Invalid form! All fields are required',
                'Dismiss',
            );
            this.loading = false;
        }
    }
}
