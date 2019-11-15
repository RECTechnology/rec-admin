import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/pages/login/login.component';
import { IsNotLoggedInGuard, IsLoggedInGuard } from 'src/services/guards/login.guard';
import { UsersPage } from 'src/pages/users/users.component';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { DashboardComponent } from 'src/pages/dashboard/dashboard.component';
import { WalletComponent } from 'src/pages/wallet/wallet.component';
import { OrganizationsComponent } from 'src/pages/organizations/organizations.component';
import { MapComponent } from 'src/pages/map/map.component';
import { ExchangersComponent } from 'src/pages/exchangers/exchangers.component';
import { TreasureAccount } from 'src/pages/treasure_account/treasure_account.component';
import { B2BSendComponent } from 'src/pages/b2b/send/send.component';
import { B2BSettingsComponent } from 'src/pages/b2b/settings/settings.component';
import { SendMail } from 'src/pages/b2b/send/send-mail/send-mail';
import { PendingChangesGuard } from 'src/services/guards/can-go-back.guard';

const ROUTES: Routes = [

  // Public Routes - user shouldn't be authenticated to accesss them
  { path: 'login', component: LoginComponent, canActivate: [IsNotLoggedInGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Private Routes - user should be authenticated to accesss them
  { path: 'users', component: UsersPage, canActivate: [IsLoggedInGuard] },
  { path: 'accounts', component: AccountsPage, canActivate: [IsLoggedInGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [IsLoggedInGuard] },
  { path: 'transactions', component: WalletComponent, canActivate: [IsLoggedInGuard] },
  { path: 'organizations', component: OrganizationsComponent, canActivate: [IsLoggedInGuard] },
  { path: 'map', component: MapComponent, canActivate: [IsLoggedInGuard] },
  { path: 'exchangers', component: ExchangersComponent, canActivate: [IsLoggedInGuard] },
  { path: 'treasure_account', component: TreasureAccount, canActivate: [IsLoggedInGuard] },

  { path: 'rec/mailing', component: B2BSendComponent, canActivate: [IsLoggedInGuard] },
  {
    path: 'rec/mailing/:id_or_new', component: SendMail,
    canActivate: [IsLoggedInGuard], canDeactivate: [PendingChangesGuard]
  },
  { path: 'b2b/settings', component: B2BSettingsComponent, canActivate: [IsLoggedInGuard] },

];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES)],
})
export class AppRoutingModule { }
