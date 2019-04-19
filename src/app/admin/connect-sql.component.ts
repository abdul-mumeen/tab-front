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
        this.tableForm = new FormGroup({
            server: new FormControl('', Validators.required),
            port: new FormControl('', Validators.required),
            database: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        // console.log(this.tableForm.get('columns'), 'sss')
    }

    connectToDatabase() {
        this.loading = true;
        if (this.tableForm.valid) {
            let valuesObject = this.tableForm.getRawValue();
            console.log(valuesObject);

            // this.db.createTables(values).subscribe(
            //     result => {
            //         this.snackBar.open(
            //             `Table ${values.name} created successfully`,
            //             'Dismiss',
            //         );
            //         this.tableForm.reset();
            //         this.loading = false;
            //     },
            //     error => {
            //         this.snackBar.open(`Transaction failed`, 'Dismiss');
            //         this.loading = false;
            //     },
            // );
        } else {
            this.snackBar.open(
                'Invalid form! All fields are required',
                'Dismiss',
            );
            this.loading = false;
        }
    }
}
