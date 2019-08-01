import { NgModule, LOCALE_ID } from '@angular/core';
import {
    MatButtonModule, MatCheckboxModule,
    MatCardModule, MatSelectModule,
    MatTooltipModule, MatPaginatorModule,
    MatMenuModule, MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatOptionModule,
    MatBadgeModule,
    MatTabsModule,
    MatChipsModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatGridListModule,
    MatListModule,

} from '@angular/material';

const MODULES = [
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatOptionModule,
    MatBadgeModule,
    MatTabsModule,
    MatChipsModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatGridListModule,
    MatListModule,
];

@NgModule({
    exports: MODULES,
    imports: MODULES,
})
export class MaterialModule {

}
