import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { environment } from '../../../environments/environment';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { EditAccountData } from '../../../dialogs/management/edit-account/edit-account.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';
import { EventsService } from 'src/services/events/events.service';

@Component({
  selector: 'account-details-tab',
  styleUrls: ['./tab_account_details.css'],
  templateUrl: './tab_account_details.html',
})
export class AccountDetailsTab implements OnDestroy, OnInit {
  public loading = false;
  public account_id = null;
  public Brand: any = environment.Brand;
  public address = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public controles: ControlesService,
    public ws: WalletService,
    public companyService: CompanyService,
    public utils: UtilsService,
    public crudAccounts: AccountsCrud,
    public alerts: AlertsService,
    public events: EventsService,
  ) { }

  public ngOnInit() {
    this.route.params
      .subscribe((params) => {
        this.account_id = params.id;
        this.setUp();
      });
  }

  public setUp() {
    this.address = this.utils.constructAddressString(this.companyService.selectedCompany);
  }

  public openEditAccount() {
    this.alerts.openModal(EditAccountData, {
      account: Object.assign({}, this.companyService.selectedCompany),
    }).subscribe((result) => {
      this.setUp();
      this.events.fireEvent('account:update');
    });
  }

  public ngOnDestroy() {
    this.companyService.selectedCompany = null;
  }
}
