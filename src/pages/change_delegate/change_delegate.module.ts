import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { IsLoggedInGuard } from '../../services/guards/login.guard';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDelegateComponent } from './change_delegate.component';
import { DelegateHeaderComponent } from './components/delegate_header/delegate_header.component';
import { NewDelegateComponent } from './components/new_delegate_change/new_delegate.component';
import { SelectAccountsDia } from './components/select_accounts_dialog/select_accounts.dia';
import { CsvUpload } from './components/csv-upload/csv-upload.dia';
import { EditAccountsDia } from './components/edit_users/edit_accounts.dia';
import { ActivateResume } from './components/activate-resume/activate-resume.dia';
import { TableListModule } from 'src/components/table-list/table-list-module';

const profileRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: ChangeDelegateComponent,
    path: 'change_delegate',
  },
  {
    canActivate: [IsLoggedInGuard],
    component: NewDelegateComponent,
    path: 'change_delegate/:id_or_new',
  },
];

@NgModule({
  declarations: [
    ChangeDelegateComponent,
    DelegateHeaderComponent,
    NewDelegateComponent,
    SelectAccountsDia,
    CsvUpload,
    EditAccountsDia,
    ActivateResume,
  ],
  entryComponents: [
    SelectAccountsDia,
    CsvUpload,
    EditAccountsDia,
    ActivateResume,
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
    TableListModule,
  ],

})
export class ChangeDelegateModule { }
