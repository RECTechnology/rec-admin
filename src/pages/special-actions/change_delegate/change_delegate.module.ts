import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { IsLoggedInGuard } from '../../../services/guards/login.guard';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDelegateComponent } from './change_delegate.component';
import { DelegateHeaderComponent } from './components/delegate_header/delegate_header.component';
import { NewDelegateComponent } from './components/new_delegate_change/new_delegate.component';
import { SelectAccountsDia } from './components/select_accounts_dialog/select_accounts.dia';
import { CsvUpload } from './components/csv-upload/csv-upload.dia';
import { ActivateResume } from './components/activate-resume/activate-resume.dia';
import { CreateDelegateChange } from './components/create_delegate_change/create_delegate_change.dia';
import { NewMassiveTransactionsComponent } from './components/new_massive_transactions/new_massive_transactions.component';

const profileRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: ChangeDelegateComponent,
    path: 'txs_blocks',
  },
  {
    canActivate: [IsLoggedInGuard],
    component: NewDelegateComponent,
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
    DelegateHeaderComponent,
    NewDelegateComponent,
    NewMassiveTransactionsComponent,
    CreateDelegateChange,
    SelectAccountsDia,
    CsvUpload,
    ActivateResume,
  ],
  entryComponents: [
    SelectAccountsDia,
    CsvUpload,
    ActivateResume,
    CreateDelegateChange,
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
