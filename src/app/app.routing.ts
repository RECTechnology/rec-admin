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
import { TreasureAccount } from 'src/pages/special-actions/treasure_account/treasure_account.component';
import { B2BSettingsComponent } from 'src/pages/special-actions/b2b/entities/settings.component';
import { PendingChangesGuard } from 'src/services/guards/can-go-back.guard';
import { B2BSendComponent } from 'src/pages/special-actions/mailing/send.component';
import { SendMail } from 'src/pages/special-actions/mailing/send-mail/send-mail';
import { ValidateWithdrawalComponent } from 'src/components/validate-withdrawal/validate-withdrawal.component';
import { CampaignReportsAccount } from 'src/pages/special-actions/campaing_reports/campaing_reports.component';
import { LogPage } from 'src/pages/special-actions/change_delegate/components/log_page/log_page';
import { B2BComponent } from 'src/pages/special-actions/b2b_page/b2b.component';
import { RatingsPage } from '../pages/ratings/ratings.component';
import { HideShowMenuItem } from '../services/guards/show_components.guard';
import { ChallengesPage } from '../pages/challenges/challenges.component';
import { ParametrizationComponent } from '../pages/parametrization/parametrization.component';
import { CampaignsPage } from '../pages/campaigns/campaigns.component';

const ROUTES: Routes = [
  // Public Routes - user shouldn't be authenticated to accesss them
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsNotLoggedInGuard],
  },
  {
    path: 'validate_withdrawal/:id',
    component: ValidateWithdrawalComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Private Routes - user should be authenticated to accesss them
  {

    path: 'txs_blocks/massive/:id/logs',
    component: LogPage,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'users',
    component: UsersPage,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'accounts',
    component: AccountsPage,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'transactions',
    component: WalletComponent,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'organizations',
    component: OrganizationsComponent,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'treasure_account',
    component: TreasureAccount,
    canActivate: [IsLoggedInGuard],
  },

  {
    path: 'rec/mailing',
    component: B2BSendComponent,
    canActivate: [IsLoggedInGuard, HideShowMenuItem],
    data: {
      item: 'menu_item_email'
    }
  },
  {
    path: 'rec/mailing/:id_or_new',
    component: SendMail,
    canActivate: [IsLoggedInGuard],
    canDeactivate: [PendingChangesGuard, HideShowMenuItem],
    data: {
      item: 'menu_item_emal'
    }
  },
  {
    path: 'b2b/settings',
    component: B2BSettingsComponent,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'b2b',
    component: B2BComponent,
    canActivate: [IsLoggedInGuard, HideShowMenuItem],
    data: {
      item: 'menu_item_b2b'
    }
  },
  {
    path: 'campaign_reports',
    component: CampaignReportsAccount,
    canActivate: [IsLoggedInGuard, HideShowMenuItem],
    data: {
      item: 'menu_item_reports'
    }
  },
  {
    path: 'ratings',
    component: RatingsPage,
    canActivate: [IsLoggedInGuard, HideShowMenuItem],
    data: {
      item: 'menu_item_qualifications'
    }
  },
  {
    path: 'challenges',
    component: ChallengesPage,
    canActivate: [IsLoggedInGuard, HideShowMenuItem],
    data: {
      item: 'menu_item_challenges'
    }
  },
  {
    path: 'campaigns',
    component: CampaignsPage,
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'parametrization',
    component: ParametrizationComponent,
    canActivate: [IsLoggedInGuard],
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES)],
})
export class AppRoutingModule {}
