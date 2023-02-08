import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { CountryPickerModule } from "ngx-country-picker";
import { IsLoggedInGuard } from "src/services/guards/login.guard";
import { SharedModule } from "src/shared/shared.module";
import { CampaignComponent } from './campaign.component';

const campaignRoutes: Routes = [
    {
      canActivate: [IsLoggedInGuard],
      component: CampaignComponent,
      path: 'campaigns/:id',
    },
  ];

@NgModule({
    declarations: [
        CampaignComponent,
    ],
    exports: [RouterModule],
    imports: [
        RouterModule.forRoot(campaignRoutes),
        SharedModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        CountryPickerModule,]
})  

export class CampaignsModule {}