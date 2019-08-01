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
    MatTableModule,

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
    MatTableModule,
];

@NgModule({
    exports: MODULES,
    imports: MODULES,
})
export class MaterialModule {

}
