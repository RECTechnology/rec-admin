
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserDetailsTab } from './tab_user_details/user_details.tab';
import { EnabledDisabledAccountsTab } from './tab_user_enabled_disabled_accounts/tab_user_enabled_disabled_accounts';
import { UserDocumentsTab } from './tab_user_documents/tab_user_document';
import { CountryPickerModule } from 'ngx-country-picker';
import { UserComponent } from './user.component';
import { IsLoggedInGuard } from 'src/services/guards/login.guard';
import { SharedModule } from 'src/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const userRoutes: Routes = [
  
  {
    canActivate: [IsLoggedInGuard],
    component: UserComponent,
    path: 'users/:id',
  },
];

@NgModule({
    declarations: [
        UserComponent,
        UserDetailsTab,
        EnabledDisabledAccountsTab,
        UserDocumentsTab,
    ],
    exports: [RouterModule, UserComponent],
    imports: [
        RouterModule.forRoot(userRoutes),
        SharedModule,
        BrowserModule,
        FormsModule,
        TranslateModule.forRoot(),
        CountryPickerModule,
    ]
})
export class UsersModule {}
