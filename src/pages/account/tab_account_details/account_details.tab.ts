import { Component, AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { environment } from '../../../environments/environment';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { EditAccountData } from '../../../pages/dialogs/edit-account/edit-account.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'account-details-tab',
  styleUrls: ['./tab_account_details.css'],
  templateUrl: './tab_account_details.html',
})
export class AccountDetailsTab implements AfterContentInit, OnDestroy, OnInit {
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
  ) {

  }

  public ngOnInit() {
    this.route.params
      .subscribe((params) => {
        this.account_id = params.id;
        this.setUp();
      });
  }

  public setUp() {
    this.loading = true;
    this.crudAccounts.find(this.account_id, 'all')
      .subscribe((resp: any) => {
        this.companyService.selectedCompany = resp.data;
        this.controles.showAccountDetails = true;
        this.address = this.utils.constructAddressString(this.companyService.selectedCompany);
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
  }

  public ngAfterContentInit() {
    // this.loading = true;
    // let roles = this.us.userData.group_data.roles;
    // this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY'); // <<< TODO: Improve
    // this.getUsers();
  }

  public openEditAccount() {
    this.alerts.openModal(EditAccountData, {
      account: Object.assign({}, this.companyService.selectedCompany)
    }).subscribe((result) => {
      this.setUp();
    });
  }

  public openDeleteAccount() {
    // let dialogRef = this.dialog.open();
    // dialogRef.componentInstance.account = this.companyService.selectedCompany;

    // dialogRef.afterClosed().subscribe(result => {
    //   dialogRef = null;
    // });
  }

  public expelUser() {
    return;
  }

  public ngOnDestroy() {
    this.companyService.selectedCompany = null;
    this.controles.showAccountDetails = false;
  }
}
