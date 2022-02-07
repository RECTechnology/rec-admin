import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { IsLoggedInGuard } from '../../../services/guards/login.guard';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDelegateComponent } from './change_delegate.component';
import { TxsBlockHeaderComponent } from './components/txs_block_header/txs_block_header.component';
import { NewTXsBlockComponent } from './components/new_txs_block_change/new_txs_block.component';
import { SelectAccountsDia } from './components/select_accounts_dialog/select_accounts.dia';
import { CsvUpload } from './components/csv-upload/csv-upload.dia';
import { ActivateResume } from './components/activate-resume/activate-resume.dia';
import { CreateTXsBlockChange } from './components/create_txs_block_change/create_txs_block_change.dia';
import { NewMassiveTransactionsComponent } from './components/new_massive_transactions/new_massive_transactions.component';

const profileRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: ChangeDelegateComponent,
    path: 'txs_blocks',
  },
  {
    canActivate: [IsLoggedInGuard],
    component: NewTXsBlockComponent,
    path: 'txs_blocks/delegate/:id_or_new',
  },
  {
    canActivate: [IsLoggedInGuard],
    component: NewMassiveTransactionsComponent,
    path: 'txs_blocks/massive/:id_or_new',
  },
];

@NgModule({
  declarations: [
    ChangeDelegateComponent,
    TxsBlockHeaderComponent,
    NewTXsBlockComponent,
    NewMassiveTransactionsComponent,
    CreateTXsBlockChange,
    SelectAccountsDia,
    CsvUpload,
    ActivateResume,
  ],
  entryComponents: [
    SelectAccountsDia,
    CsvUpload,
    ActivateResume,
    CreateTXsBlockChange,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(profileRoutes),
    SharedModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
  ],
})
export class ChangeDelegateModule { }
