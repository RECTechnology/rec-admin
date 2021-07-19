import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageBase } from '../../../../../bases/page-base';
import { LoginService } from '../../../../../services/auth/auth.service';
import { ControlesService } from '../../../../../services/controles/controles.service';
import { Sort } from '@angular/material/sort';
import { SelectAccountsDia } from '../select_accounts_dialog/select_accounts.dia';
import { EditAccountsDia } from '../edit_users/edit_accounts.dia';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../../services/company/company.service';
import { CsvUpload } from '../csv-upload/csv-upload.dia';
import { AdminService } from '../../../../../services/admin/admin.service';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { ActivateResume } from '../activate-resume/activate-resume.dia';
import { DelegatedChangesDataCrud } from 'src/services/crud/delegated_changes/delegated_changes_data';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';

const mapAccount = (e) => {
  e.selected = true;
  e.account = e.account || { id: e.id, name: e.name };
  e.exchanger = e.exchanger || { id: e.exchanger_id };
  return e;
};

@Component({
  selector: 'new-delegate',
  templateUrl: './new_delegate.html',
})
export class NewDelegateComponent extends PageBase {
  public pageName = 'New Delegate Change';
  public selectedAccounts = [];
  public sortedData = [];
  public searchQuery = '';
  public selectedAccountsCount = 0;
  public allSelected = false;
  public allSelectedSaved = false;
  public editing = false;

  public idOrNew = null;
  public isNew = true;
  public delegate: any = {};

  public changeScheduled: any = false;
  public dateScheduled = '';
  public timeScheduled = '';

  public savingEntries: boolean = false;
  public objectsSent = 0;
  public objectsToSend = 0;
  public percentageSent = 0;

  public limitSaved = 10;
  public offsetSaved = 0;
  public totalSaved = 0;

  public saved = false;
  public notSavedItems = [];
  public dataPassed = false;
  public savedItems = [];
  public readonly = false;

  constructor(
    public titleService: Title,
    public ls: LoginService,
    public controles: ControlesService,
    public route: ActivatedRoute,
    public router: Router,
    public company: CompanyService,
    public adminService: AdminService, 
    public utils: UtilsService,
    public changeCrud: DelegatedChangesCrud,
    public changeDataCrud: DelegatedChangesDataCrud,
    public alerts: AlertsService,
  ) {
    super();
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idOrNew = params.id_or_new;
      this.isNew = this.idOrNew === 'new';

      if (!this.isNew) {
        this.getDelegate();
        this.getDelegateData();
      }
    });
  }

  public getDelegate() {
    this.loading = true;
    this.changeCrud.find(this.idOrNew).subscribe(
      (resp) => {
        this.delegate = resp.data;
        if (this.delegate.scheduled_at) {
          const date = new Date(this.delegate.scheduled_at);
          const parts = this.utils.parseDateToParts(date);

          this.dataPassed = this.utils.hasDatePassed(date);

          this.dateScheduled = parts.dateStr;
          this.timeScheduled = parts.timeStr;
          this.readonly = this.delegate.status != 'draft';
        }
        this.loading = false;
      },
      (error) => (this.loading = false),
    );
  }

  public getDelegateData() {
    this.loading = true;
    this.changeDataCrud
      .list({
        delegated_change_id: this.idOrNew,
        limit: this.limitSaved,
        offset: this.offsetSaved,
        order: this.sortDir,
        query: this.searchQuery,
        sort: this.sortID,
      })
      .subscribe(
        (resp) => {
          this.savedItems = resp.data.elements.map((el) => {
            el.selected = false;
            return el;
          });
          this.totalSaved = resp.data.total;
          this.loading = false;
        },
        (error) => (this.loading = false),
      );
  }

  public saveScheduled() {
    const scheduled_at = new Date(this.dateScheduled + ' ' + this.timeScheduled);
    this.loading = true;

    this.changeCrud.update(this.delegate.id, { scheduled_at: scheduled_at.toISOString() }).subscribe(
      (resp) => {
        this.alerts.showSnackbar('Updated schedule time', 'ok');
        this.getDelegate();
      },
      this.alerts.observableErrorSnackbar,
      () => {
        this.changeScheduled = false;
        this.loading = false;
        this.savingEntries = false;
      },
    );
  }

  public activateChange() {
    this.alerts
      .openModal(ActivateResume, {
        change: this.delegate,
      })
      .subscribe((resp) => {
        if (resp) {
          this.router.navigate(['/change_delegate']);
        }
      }, this.alerts.observableErrorSnackbar);
  }

  public changed() {
    this.selectedAccountsCount = this.notSavedItems.reduce((a, b) => a + (b.selected ? 1 : 0), 0);
  }

  public setSelectedAccounts(users) {
    this.notSavedItems = [...users];

    const notSavedMap = this.notSavedItems.slice().map((el) => el.id);
    this.savedItems = this.savedItems.filter((el) => {
      return !notSavedMap.includes(el.id);
    });
  }

  public editScheduledAt() {
    this.changeScheduled = true;
  }

  public closeScheduledAt() {
    this.changeScheduled = false;
  }

  public getSelected(status = true) {
    return [...this.getSelectedSaved(), ...this.getSelectedUnsaved()];
  }

  public getSelectedSaved(status = true) {
    const saved = this.savedItems.filter((el) => el.selected === status);
    return [...saved];
  }

  public getSelectedUnsaved(status = true) {
    const notSaved = this.notSavedItems.filter((el) => el.selected === status);
    return [...notSaved];
  }

  public openEditSelected() {
    this.openEditAccounts(
      [...this.getSelected()],
      (resp) => resp && resp.accounts && this.setSelectedAccounts(resp.accounts.map(mapAccount)),
    );
  }

  public openEditAccounts(accounts: Account[], cback: (resp: any) => any) {
    this.alerts
      .openModal(EditAccountsDia, {
        accountCount: accounts.length,
        accounts,
      })
      .subscribe(cback);
  }

  public openEditAccount(account, i, saved = false) {
    this.openEditAccounts([Object.assign({}, account)], (resp) => {
      if (resp && resp.accounts) {
        if (!saved) {
          this.notSavedItems[i] = resp.accounts[0];
        }
        if (saved) {
          resp.accounts[0].selected = true;
          this.savedItems.splice(i, 1);
          this.notSavedItems.push(resp.accounts[0]);
        }
      }
    });
  }

  public selectAll() {
    this.notSavedItems = this.notSavedItems.map((el) => {
      el.selected = this.allSelected;
      return el;
    });
    this.changed();
  }

  public selectAllSaved() {
    this.savedItems = this.savedItems.map((el) => {
      el.selected = this.allSelectedSaved;
      return el;
    });
    this.changed();
  }

  public searchAccounts() {
    this.getDelegateData();
  }

  public sortData(sort: Sort): void {
    const data = this.selectedAccounts.slice();
    if (!sort.active || sort.direction === '') {
      this.selectedAccounts = data;
      return;
    }

    this.sortID = sort.active;
    this.sortDir = sort.direction.toUpperCase();
    this.getDelegateData();
  }

  public openSelectAccounts() {
    this.alerts
      .openModal(
        SelectAccountsDia,
        {
          selectedAccounts: this.savedItems.slice(),
          sortType: 'PRIVATE',
        },
        { width: '80vw', height: '80vh' },
      )
      .subscribe((result) => {
        if (result) {
          this.total = this.sortedData.length + (result.accounts.length - this.sortedData.length);
          this.setSelectedAccounts(result.accounts.map(mapAccount));

          if (result.edit) {
            this.openEditSelected();
          }
        }
      });
  }

  public newImport() {
    this.alerts.openModal(CsvUpload, {}).subscribe((resp) => {
      if (resp) {
        this.adminService.sendChangeDelegateCsv(resp, this.delegate.id).subscribe(
          (respDelegate) => {
            this.alerts.showSnackbar(respDelegate.message, 'ok');
            this.getDelegate();
            this.getDelegateData();
          },
          (error) => {
            console.log('asñpoidjasñdjas', error);
            if (error.data && error.data.length > 0) {
              this.validationErrors = error.data;
            }
            else {
                this.alerts.showSnackbar(error.message);
            }
          },
        );
      }
    });
  }

  public async saveEntries() {
    const accounts = this.getSelectedUnsaved();
    this.savingEntries = true;
    this.objectsToSend = accounts.length;
    this.objectsSent = 0;
    let errored = false;

    for (const data of accounts) {
      const changeData: any = {
        account_id: +data.account.id,
        amount: data.amount || 0,
        delegated_change_id: this.idOrNew,
        exchanger_id: data.exchanger_id || +data.exchanger.id,
      };

      UtilsService.setAllIfPresent(data, changeData, ['expiry_date', 'pan', 'cvv2']);

      const isNew = !data.status;
      try {
        const fn = isNew
          ? this.changeDataCrud.create.bind(this.changeDataCrud)
          : this.changeDataCrud.update.bind(this.changeDataCrud, data.id);

        await fn(changeData).toPromise();
        this.objectsSent += 1;
        this.percentageSent = (this.objectsSent / this.objectsToSend) * 100;
      } catch (error) {
        this.handleValidationError(error);
        errored = true;
      }
    }

    this.savingEntries = false;
    if (!errored) {
      this.alerts.showSnackbar(`Saved correctly...`, 'ok');
      this.validationErrors = [];
    }

    this.notSavedItems = [];
    this.getDelegate();
    this.getDelegateData();
  }

  public deleteData(data, i, saved = false) {
    if (saved) {
      this.adminService.deleteChangeDelegateData(data.id).subscribe((resp) => {
        this.alerts.showSnackbar('Deleted data', 'ok');
        this.savedItems.splice(i, 1);
      }, this.alerts.observableErrorSnackbar);
    } else {
      this.notSavedItems.splice(i, 1);
    }
  }

  public changedPageSaved($event) {
    this.limitSaved = $event.pageSize;
    this.offsetSaved = this.limit * $event.pageIndex;
    this.getDelegateData();
  }
}
