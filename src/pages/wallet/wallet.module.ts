import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WalletComponent } from './wallet.component';
import { AddCommentDia } from './dialogs/add_comment/add_comment.dia';

import { TranslateModule } from '@ngx-translate/core';
import { ServiceUnavailable } from './service-unavailable/service-unavailable';
import { FeeResume } from './fee-resume/fee-resume';
import { FavoriteBTN } from './favorite-btn/favorite-btn.component';
import { CardFailedDia } from './dialogs/card_failed/card_failed.dia';
import { ExportTxsDia } from './dialogs/export-txs/export-txs.dia';
import { CashOutDia } from './dialogs/cash-out/cash-out.dia';
import { CashOutTesoroDia } from './dialogs/cash-out-tesoro/cash-out-tesoro.dia';

const routes: Routes = [{ path: '', component: WalletComponent }];

@NgModule({
  declarations: [
    WalletComponent,
    AddCommentDia,
    ServiceUnavailable,
    FeeResume,
    FavoriteBTN,
    CardFailedDia,
    ExportTxsDia,
    CashOutDia,
    CashOutTesoroDia,
  ],
  entryComponents: [
    AddCommentDia,
    CardFailedDia,
    ExportTxsDia,
    CashOutDia,
    CashOutTesoroDia,
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
