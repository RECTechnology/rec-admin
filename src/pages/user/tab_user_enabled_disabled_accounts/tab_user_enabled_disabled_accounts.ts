import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/services/auth/auth.service';
import { CompanyService } from 'src/services/company/company.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { SmsService } from 'src/services/sms/sms.service';

@Component({
  providers: [SmsService],
  selector: 'user-enabled-disabled-accounts-tab',
  templateUrl: './tab_user_enabled_disabled_accounts.html',
})
export class EnabledDisabledAccountsTab implements OnInit {
  public titleService: Title;
  public pageName: string;
  public ls: LoginService;
  public user: any = {};
  public user_id = null;
  public parent: any;
  public Brand: any = environment.Brand;
  public enabledAccounts = true;
  public disabledAccounts = true;

  constructor(public route: ActivatedRoute, public usersCrud: UsersCrud, public companyService: CompanyService) {}

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.user_id = params.id;
    });
    this.getUser();
  }

  public getUser() {
    this.usersCrud.find(this.user_id).subscribe((res) => {
      this.user = res.data;
    });
  }
}
