import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    constructor(private loc: Location, private authService: AuthService) {}

    ngOnInit() {}
    ngOnDestroy() {}
}
