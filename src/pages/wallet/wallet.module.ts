import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WalletComponent } from './wallet.component';
import { AddCommentDia } from './dialogs/add_comment/add_comment.dia';

import { TranslateModule } from '@ngx-translate/core';
import { ExportTxsDia } from './dialogs/export-txs/export-txs.dia';
import { CashOutDia } from './dialogs/cash-out/cash-out.dia';
import { CashOutTesoroDia } from './dialogs/cash-out-tesoro/cash-out-tesoro.dia';
import { TxDetails } from './dialogs/tx_details/tx_details.dia';

@NgModule({
  declarations: [
    WalletComponent,
    AddCommentDia,
    ExportTxsDia,
    CashOutDia,
    CashOutTesoroDia,
    TxDetails,
  ],
  entryComponents: [
    AddCommentDia,
    ExportTxsDia,
    CashOutDia,
    CashOutTesoroDia,
    TxDetails,
  ],
  exports: [RouterModule],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
  ],
})
export class WalletModule { }
