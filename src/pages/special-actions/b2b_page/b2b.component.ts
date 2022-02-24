import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageBase, TablePageBase } from 'src/bases/page-base';
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
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ListAccountsParams } from 'src/interfaces/search';
import { ExportDialog } from 'src/dialogs/other/export-dialog/export.dia';
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
    public type = '';
    public pendingCuantity = 0;

   
    public headerOpts: TableListHeaderOptions = { input: true, refresh: true, deepLinkQuery: true };
   
   
  
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
        if(params.type){
          this.type = params.type;
        }
        
       
      });
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
        sort: this.sortID,
      };
  
  
      return data;
    }
  
    public openAddUserB2B() {
      this.alerts
        .openModal(AddB2BModal, {
         
        })
        .subscribe((result) => {
          this.search();
        });
    }


    public search(query: string = this.query) {
  
      const data: any = this.getCleanParams(query);
      this.loading = true;
      this.query = query;
  
      this.searchObs = this.crudAccounts.list(data,'all').subscribe(
        (resp: any) => {
          console.log("Im in searchObs in b2b",resp);
          this.data = resp.data.elements;
          this.total = resp.data.total;
          this.sortedData = this.data.slice();
          for(let item of this.data.slice()){
              if(item.rezero_b2b_access == 'pending'){
                this.pendingCuantity = this.pendingCuantity+1;
              }
          }
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
  
    }
  
    public viewAccount(account, tab = 'details') {
      this.router.navigate([`/accounts/${account.id}`], { queryParams: { tab } });
    }
  
    
}
