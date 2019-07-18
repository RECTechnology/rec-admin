import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LANGS, LANG_MAP } from '../../data/consts';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth.service';
import { CompanyService } from '../../services/company/company.service';
import BaseDialog from '../../bases/dialog-base';
import { MatDialogRef } from '@angular/material';
import { Brand } from '../../environment/brand';

@Component({
  selector: 'account-selector',
  templateUrl: '../../components/account-selector/account.selector.html',
})
export class AccountSelector extends BaseDialog {
  public currentAccount;
  public Brand = Brand;
  constructor(
    private translate: TranslateService,
    private us: UserService,
    private ls: LoginService,
    private companyService: CompanyService,
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
