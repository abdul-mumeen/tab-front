import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'page-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss'],
})
export class FooterComponent {
  loading:boolean = false;
  
  constructor(
      private authService: AuthService,
      private snackBar: MatSnackBar,
      private router: Router,
  ) {}

  async goHome() {
      this.loading = true;
      try {
          await this.authService.logout();
          this.router.navigate(['/landing']);
      } catch {
        this.snackBar.open(
          'Logout failed!',
          'Close'
        )
      } finally {
          this.loading = false;
      }
  }
}