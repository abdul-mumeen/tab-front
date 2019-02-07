import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
} from '@angular/material'

const matModules = [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
];

@NgModule({
    imports: matModules,
    exports: matModules,
})
export class MaterialModule {
}
