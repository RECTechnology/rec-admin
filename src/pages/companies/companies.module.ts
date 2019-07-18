import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CompaniesComponent } from './companies.component';
import { IsResellerGuard, IsLoggedInGuard } from '../../services/guards/login.guard';
import { TranslateModule } from '@ngx-translate/core';

const profileRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard, IsResellerGuard],
    component: CompaniesComponent,
    path: 'manage/companies',
  },
];

@NgModule({
  declarations: [
    CompaniesComponent,
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
export class CompaniesModule { }
