import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { AdminService } from '../../../services/admin/admin.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { Account } from 'src/shared/entities/account.ent';
import { Tier } from 'src/shared/entities/tier.ent';

@Component({
  selector: 'documents-tab',
  styleUrls: ['./account_documents.tab.css'],
  templateUrl: './account_documents.tab.html',
})
export class AccountDocuments {
  @Input() public id = '';
  @Input() public account: Account;
  @Input() public tiers: Tier[];

  public loading = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public controles: ControlesService,
    public ws: WalletService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public utils: UtilsService,
    public alerts: AlertsService,
    public crudAccounts: AccountsCrud,
    public tiersCrud: TiersCrud,
  ) { }

  public ngOnInit() {
    this.getTiers();
    this.route.params
      .subscribe((params) => {
        this.id = params.id;
      });
  }

  public getTiers() {
    this.tiersCrud.listInOrder({ offset: 0, limit: 100 })
      .subscribe((tiers: Tier[]) => {
        const currentTier: any = this.account.level || {};
        const tIndex = tiers.findIndex((t) => t.id === currentTier.id);

        this.tiers = tiers.map((el, index) => {
          if (index <= tIndex) {
            el.validated = true;
          } else {
            el.validated = false;
          }
          return el;
        });
      });
  }

  public tryValidateTier(tier: Tier) {
    this.loading = true;
    this.crudAccounts.update(this.id, { level_id: tier.id })
      .subscribe((resp) => {
        this.account = resp.data;
        this.loading = false;
        this.alerts.showSnackbar('Validate tier successfully!');
        this.getTiers();
      }, (err) => {
        this.loading = false;
        this.alerts.showSnackbar(err.message);
      });
  }
}
