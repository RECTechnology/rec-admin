import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ExportTxsDia } from './dialogs/export-txs/export-txs.dia';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [
        ExportTxsDia,
        DashboardComponent,
    ],
    exports: [
        RouterModule,
        DashboardComponent,
    ],
    imports: [
        SharedModule,
        BrowserModule,
        FormsModule,
        TranslateModule.forRoot(),
    ]
})
export class DashboardModule { }
