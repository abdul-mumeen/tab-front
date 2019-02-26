import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'page-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
  @Input() showBackButton:boolean = false;

  constructor(
      private loc: Location,
  ) {}

  back() {
      this.loc.back();
  }
}