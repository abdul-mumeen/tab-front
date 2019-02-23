import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss'],
})
export class AdminComponent implements OnInit {
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

    toggleDropdown(event){
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
