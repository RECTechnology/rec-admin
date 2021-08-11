import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TablePageBase } from 'src/bases/page-base';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { environment } from 'src/environments/environment';
import { ListAccountsParams } from 'src/interfaces/search';
import { LoginService } from 'src/services/auth/auth.service';
import { CompanyService } from 'src/services/company/company.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { SmsService } from 'src/services/sms/sms.service';


@Component({
  providers: [SmsService],
  selector: 'user-enabled-disabled-accounts-tab',
  templateUrl: './tab_user_enabled_disabled_accounts.html',
})
export class EnabledDisabledAccountsTab   implements OnInit {

  public titleService: Title;
  public pageName: string;
  public ls: LoginService;
  public user: any = {};
  public user_id = null;
  public parent: any;
  public Brand: any = environment.Brand;
  public enabledAccounts = true;
  public disabledAccounts = true;

 
  constructor(
    public route: ActivatedRoute,
    public usersCrud: UsersCrud,
    public companyService: CompanyService,
  ) {
   
  }

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
