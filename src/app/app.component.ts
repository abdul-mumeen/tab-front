import { Component } from '@angular/core';
import { TableauService } from './shared/tableau/services/tableau.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private tabService: TableauService) {
    }
}
