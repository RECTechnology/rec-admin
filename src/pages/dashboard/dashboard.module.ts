import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ExportTxsDia } from './dialogs/export-txs/export-txs.dia';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  declarations: [
    ExportTxsDia,
  ],
  entryComponents: [
    ExportTxsDia,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
  ],
})
export class WalletModule { }
