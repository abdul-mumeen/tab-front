import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DBService } from '../services/db.service';
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss'],
})
export class AdminComponent implements OnInit {
    loading: boolean = false;
    showDropdownContent = false;
    showTableDropdown = false;
    tables: Array<any> = [];

    @HostListener('document:click', ['$event'])
    onClick(event) {
        this.showDropdownContent = false;
        this.showTableDropdown = false;
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private db: DBService,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        this.db.getTables().subscribe(
            result => {
                this.tables = result.data.tables;
            },
            error => {
                this.snackBar.open('Error getting tables', 'Dismiss');
            },
        );
    }

    toggleDropdown(event) {
        this.showDropdownContent = !this.showDropdownContent;
        event.stopPropagation();
    }

    handleTableClick(event, tableName?) {
        this.showTableDropdown = !this.showTableDropdown;
        event.stopPropagation();
        if (tableName) {
            // if (!this.db.tableauTables.includes(tableName)) {
            //     this.snackBar.open(
            //         'Make the table active on tableau and try again',
            //         'dismiss',
            //     );
            //     return;
            // }
            this.router.navigate([`tables/${tableName}`]);
        }
    }

    goToConnect() {
        this.router.navigate(['admin/connect_sql']);
    }

    async logout() {
        this.loading = true;
        try {
            await this.authService.logout();
            this.router.navigate(['/landing']);
        } catch {
        } finally {
            this.loading = false;
        }
    }
}
