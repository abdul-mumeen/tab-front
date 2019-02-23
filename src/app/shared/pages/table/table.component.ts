import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    showDropdownContent = false;

    @HostListener('document:click', ['$event'])
    onClick(event) {
        this.showDropdownContent = false;
    }

    constructor(
        private loc: Location,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {}
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
}
