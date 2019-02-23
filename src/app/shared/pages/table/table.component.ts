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

    ngOnInit() {
        this.tableName = this.activatedRoute.snapshot.paramMap.get('name');
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

    back() {
        this.loc.back();
    }
}
