import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { Account } from 'src/shared/entities/account.ent';
import { TableListOptions, TlHeader, TlItemOption } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { AccountsExportDefaults } from 'src/data/export-defaults';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';
import { UserService } from 'src/services/user.service';
import { CompanyService } from 'src/services/company/company.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { WalletService } from 'src/services/wallet/wallet.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { ListAccountsParams } from 'src/interfaces/search';
import { AddB2BModal } from './b2b-modal/b2b-modal';

@Component({
  selector: 'b2b-component',
  templateUrl: './b2b.html',
})
export class B2BComponent extends TablePageBase {
  public pageName = 'Accounts';
  public sortedData: Account[] = [];
  public accountID = null;
  public openDetails = false;
  public type = 'pending';


  public headerOpts: TableListHeaderOptions = { input: true, refresh: true, deepLinkQuery: true };

  public tableOptions: TableListOptions = {
    optionsType: 'menu',
    
   

  };
  public itemOptions: TlItemOption[] = [
    TlItemOptions.Revoke(this.revokePermission.bind(this), {
      ngIf: (item) => item.rezero_b2b_access == 'granted',
    }),
    TlItemOptions.Grant(this.grantPermission.bind(this), {
      ngIf: (item) => item.rezero_b2b_access == 'pending',
    }),
    
  ];
  public headers: TlHeader[] = [
    TlHeaders.Id,
    TlHeaders.NameB2B,
    TlHeaders.UserNameB2B,
    {
      accessor: (v) => (v.kyc_manager.dni ?? {}),
      sortable: false,
      title: 'USER',
      type: 'code',
    },
    {
      accessor: (v) => (v.kyc_manager.phone ?? {}),
      sortable: false,
      title: 'PHONE',
    },
    TlHeaders.CIFB2B,
  ];


  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public us: UserService,
    public companyService: CompanyService,
    public utils: UtilsService,
    public router: Router,
    public controles: ControlesService,
    public ws: WalletService,
    public ls: LoginService,
    public crudAccounts: AccountsCrud,
    public alerts: AlertsService,
    protected campaignsService: CampaignsCrud,
  ) {
    super(router);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams.subscribe((params) => {
      this.accountID = params.id;
      this.limit = params.limit ?? 10;
      this.offset = params.offset;
      this.sortDir = params.sortDir;
      this.sortID = params.sortID;
      if (params.type) {
        this.type = params.type;
      }
    });
  }

  public revokePermission(user) {
      console.log("IM in revokePermision",user);
      this.crudAccounts.update(user.id,{rezero_b2b_access:'not_granted'}).subscribe(
        (resp: any) => {
          this.alerts.showSnackbar(
            "REVOKED_PERMISSION",
            'OK'
          );
          this.search();

        },
        (error) => {
          this.loading = false;
        },
      );
  }

  public grantPermission(user) {
    this.crudAccounts.update(user.id,{rezero_b2b_access:'granted'}).subscribe(
      (resp: any) => {
        this.alerts.showSnackbar(
          "GRANTED_PERMISSION",
          'OK'
        );       
         this.search();
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  ngOnChange() {
  }

  public getCleanParams(query?: string) {
    let data: ListAccountsParams = {
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.query,
      rezero_b2b_access:this.type,
      sort: this.sortID,
    };
    return data;
  }

  public openAddUserB2B() {
    this.alerts
      .openModal(AddB2BModal, {
      })
      .subscribe((result) => {
        if(result){
          this.crudAccounts.update(result.accountId,{rezero_b2b_access:'granted',rezero_b2b_username:result.username}).subscribe(
            (resp: any) => {
              this.alerts.showSnackbar(
                "ADDED_TO_B2B",
                'OK'
              );  
              this.search();

            },
            (error) => {
              this.loading = false;
            },
          );
        }
      });
  }


  public search(query: string = this.query) {
    const data: any = this.getCleanParams(query);
    this.loading = true;
    this.query = query;
    this.searchObs = this.crudAccounts.list(data, 'all').subscribe(
      (resp: any) => {
        this.data = resp.data.elements;
        this.total = resp.data.total;
        this.sortedData = this.data.slice();
        this.showing = this.data.length;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
    return this.searchObs;
  }

  public changedType() {
    this.limit = 10;
    this.offset = 0;
    super.addToQueryParams({
      type: this.type,
    });
    this.search()

  }

  public viewAccount(account, tab = 'details') {
    this.router.navigate([`/accounts/${account.id}`], { queryParams: { tab } });
  }


}