import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DBService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    showDropdownContent = false;
    tableName: string;
    tableMetadata: any;
    error: boolean = false;

    @HostListener('document:click', ['$event'])
    onClick(event) {
        this.showDropdownContent = false;
    }

    constructor(
        private loc: Location,
        private dbService: DBService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) {}

    async ngOnInit() {
        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
        try {
            this.tableMetadata = await this.dbService.getTableInfo(
                this.tableName,
            );
        } catch {
            this.error = true;
        }
    }
    ngOnDestroy() {}

    toggleDropdown(event) {
        this.showDropdownContent = !this.showDropdownContent;
        event.stopPropagation();
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

    handleClick(event: any, action: string) {
        event.preventDefault();
        switch (action) {
            case 'add':
                this.router.navigate([`tables/${this.tableName}/add`]);
                break;
            default:
                console.log('error');
        }
    }

    back() {
        this.loc.back();
    }
}
