import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
    constructor(private loc: Location) {}

    ngOnInit() {}
    ngOnDestroy() {}
    back() {
        this.loc.back();
    }
}
