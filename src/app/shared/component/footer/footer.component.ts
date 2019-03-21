import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'page-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss'],
})
export class FooterComponent {
    @Input()
    leftButtonText: string = 'Home';
    @Output()
    leftButtonClick = new EventEmitter<any>();

    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
    ) {}

    async goHome() {
        if (this.leftButtonText !== 'Home') {
            this.leftButtonClick.emit();
            return;
        }

        if (this.authService.user.role === 'admin') {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/tables']);
        }
    }
}
