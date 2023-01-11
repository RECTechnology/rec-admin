
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { environment } from '../../../environments/environment';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
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
  public balance = 0;

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
    this.balance = environment.Brand.name === 'REC' ? 
    this.companyService.selectedCompany.getBalance('REC') : 
    this.companyService.selectedCompany.getBalance('ROSA');

  }

  public openEditAccount() {
    this.router.navigate([`/accounts/edit/${this.account_id}`]);
  }

  public ngOnDestroy() {
    this.companyService.selectedCompany = null;
  }
}
