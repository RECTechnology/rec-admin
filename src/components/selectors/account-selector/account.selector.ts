import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/auth/auth.service';
import { CompanyService } from '../../../services/company/company.service';
import BaseDialog from '../../../bases/dialog-base';
import { MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'account-selector',
  templateUrl: './account.selector.html',
})
export class AccountSelector extends BaseDialog {
  public currentAccount;
  public Brand: any = environment.Brand;
  constructor(
    public translate: TranslateService,
    public us: UserService,
    public ls: LoginService,
    public companyService: CompanyService,
    public dialogRef: MatDialogRef<AccountSelector>,
  ) {
    super();
    this.currentAccount = this.us.userData.group_data;
    this.companyService.doGetCompanies();
  }

  public selectAccount(acc) {
    this.currentAccount = acc;
    this.companyService.selectCompany(acc, true);
  }
}
