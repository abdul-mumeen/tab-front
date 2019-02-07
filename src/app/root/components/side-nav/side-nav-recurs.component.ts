import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SideNavModel } from './side-nav.model';

@Component({
    selector: 'app-side-nav-recurs',
    styleUrls: ['./side-nav-recurs.component.scss'],
    templateUrl: './side-nav-recurs.component.html',
})

export class SideNavRecursComponent implements OnInit {

    @Input('list') list: SideNavModel[];
    @Input() padding: number = 0;

    subPadding: number;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.subPadding = this.padding + 15;
    }

    navigate(nav: SideNavModel) {
        if(nav.route) {
            if(nav.pageTitle) document.title = `${nav.pageTitle} - Corp Apps`;
            else document.title = `${nav.name} - Corp Apps`;
        }
    }
}
