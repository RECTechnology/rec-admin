import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/components/login/login.component';
import { IsNotLoggedInGuard, IsLoggedInGuard } from 'src/services/guards/login.guard';
import { UsersPage } from 'src/pages/users/users.component';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { DashboardComponent } from 'src/pages/dashboard/dashboard.component';
import { WalletComponent } from 'src/pages/wallet/wallet.component';
import { BussinessComponent } from 'src/pages/bussiness/bussiness.component';
import { MapComponent } from 'src/pages/map/map.component';
import { SellersComponent } from 'src/pages/sellers/sellers.component';
import { TreasureAccount } from 'src/pages/treasure_account/treasure_account.component';

const ROUTES: Routes = [

  // Public Routes - user shouldn't be authenticated to accesss them
  { path: 'login', component: LoginComponent, canActivate: [IsNotLoggedInGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Private Routes - user should be authenticated to accesss them
  { path: 'users', component: UsersPage, canActivate: [IsLoggedInGuard] },
  { path: 'accounts', component: AccountsPage, canActivate: [IsLoggedInGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [IsLoggedInGuard] },
  { path: 'transactions', component: WalletComponent, canActivate: [IsLoggedInGuard] },
  { path: 'bussiness', component: BussinessComponent, canActivate: [IsLoggedInGuard] },
  { path: 'map', component: MapComponent, canActivate: [IsLoggedInGuard] },
  { path: 'sellers', component: SellersComponent, canActivate: [IsLoggedInGuard] },
  { path: 'treasure_account', component: TreasureAccount, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES)],
})
export class AppRoutingModule { }
