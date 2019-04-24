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
        private router: Router,
    ) {
        // tableau.extensions.initializeAsync();
        this.tableForm = new FormGroup({
            host: new FormControl('', Validators.required),
            port: new FormControl('', Validators.required),
            database: new FormControl('', Validators.required),
            user: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {}

    async connectToDatabase() {
        this.loading = true;
        if (this.tableForm.valid) {
            let valuesObject = this.tableForm.getRawValue();
            const connectionDetails = this.authService.connectionDetails;

            if (
                !connectionDetails ||
                connectionDetails.name !== valuesObject.host
            ) {
                this.snackBar.open(
                    'The database connected to in tableau must match the one here. Kindly verify and try again',
                    'dismiss',
                );
            }

            try {
                valuesObject.client = connectionDetails.type.toLowerCase();
                valuesObject.port = +valuesObject.port;

                this.db.connectToDatabase(valuesObject).subscribe(
                    result => {
                        this.snackBar.open('Success', 'Dismiss');
                        this.router.navigate(['table/new']);
                    },
                    err => {
                        this.snackBar.open(err.error.data.message, 'Dismiss');
                    },
                );
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
