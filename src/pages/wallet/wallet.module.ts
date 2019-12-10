import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WalletComponent } from './wallet.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletComponent,
  ],
  exports: [RouterModule],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
  ],
})
export class WalletModule { }
