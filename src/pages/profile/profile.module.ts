import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ProfileComponent } from './profile.component';
import { CompaniesTab } from './tab_companies/companies.tab';
import { ChangePassword } from './dialogs/change-password/change-password.dia';
import { IsLoggedInGuard } from '../../services/guards/login.guard';
import { Activate2FA } from './dialogs/activate-2fa/activate-2fa';
import { ShowQrDia } from './dialogs/show-qr/show-qr';
import { TranslateModule } from '@ngx-translate/core';

const profileRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: ProfileComponent,
    path: 'user',
  },
];

@NgModule({
  declarations: [
    ProfileComponent,
    CompaniesTab,
    ChangePassword,
    Activate2FA,
    ShowQrDia,
  ],
  entryComponents: [
    ChangePassword,
    Activate2FA,
    ShowQrDia,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(profileRoutes),
    SharedModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forChild(),
  ],
})
export class ProfileModule { }
