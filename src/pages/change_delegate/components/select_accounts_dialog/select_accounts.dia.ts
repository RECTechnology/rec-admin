import { Component, EventEmitter } from '@angular/core';
import { MatDialogRef, Sort } from '@angular/material';
import BaseDialog from '../../../../bases/dialog-base';
import { CompanyService } from '../../../../services/company/company.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'select-accounts',
  styleUrls: [
    './select_accounts.css',
  ],
  templateUrl: './select_accounts.html',
})
export class SelectAccountsDia extends BaseDialog {

  public selectedAccounts = [];
  public newSelectedAccounts = [];
  public unselectedAccounts = [];

  public sortedSelectedAccounts = [];
  public sortedUnselectedAccounts = [];

  public totalAccountsUnsorted = 0;
  public offsetUnsorted = 0;
  public limitUnsorted = 30;
  public loadingUnsorted = false;

  public totalAccountsSorted = 0;
  public offsetSorted = 0;
  public limitSorted = 10;
  public loadingSorted = false;
  public showEdit = true;

  public unselectedSearch = '';
  public sortIDUnsorted = 'id';
  public sortDirUnsorted = 'desc';
  public selectedIDs = [];
  public searchSelectedQwery: string = '';
  public searchSelected: any = '';

  public sortType = 'PRIVATE';
  public onSelect: EventEmitter<any> = new EventEmitter();
  public onUnselect: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SelectAccountsDia>,
    public company: CompanyService,
    public accountsCrud: AccountsCrud,
  ) {
    super();
  }

  public ngAfterContentInit() {
    this.getAccounts();
  }

  public getAccounts() {
    this.loading = true;
    this.selectedIDs = this.selectedAccounts.slice().map((el) => (el.account ? el.account.id : el.id));

    this.accountsCrud.search({
      offset: this.offsetUnsorted, limit: this.limitUnsorted,
      query: { search: this.unselectedSearch }, sort: this.sortIDUnsorted,
      order: this.sortDirUnsorted, active: 1, type: this.sortType,
    }).subscribe((resp) => {
      this.unselectedAccounts = resp.data.elements;
      this.totalAccountsUnsorted = resp.data.total;

      this.sortedUnselectedAccounts = this.unselectedAccounts.slice()
        .filter((e) => {
          return this.selectedIDs.indexOf(e.id) === -1;
        });
      this.loading = false;
    });
  }

  public selectAccount(account) {
    const ind = this.sortedUnselectedAccounts.indexOf(account);
    this.sortedUnselectedAccounts.splice(ind, 1);
    this.newSelectedAccounts.unshift(account);

    this.onSelect.emit(account);
  }

  public unselectAccount(account) {
    const ind = this.newSelectedAccounts.indexOf(account);
    this.newSelectedAccounts.splice(ind, 1);
    this.sortedUnselectedAccounts.unshift(account);

    this.onUnselect.emit(account);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public select(opts = {}): void {
    this.dialogRef.close({ accounts: this.newSelectedAccounts, ...opts });
  }

  public selectAndEdit() {
    this.select({ edit: true });
  }

  public changedPageUnsorted($event) {
    this.limitUnsorted = $event.pageSize;
    this.offsetUnsorted = this.limitUnsorted * ($event.pageIndex);
    this.getAccounts();
  }

  public sortDataSelected(sort: Sort): void {
    const data = this.selectedAccounts.slice();
    if (!sort.active || sort.direction === '') {
      this.selectedAccounts = data;
      return;
    }

    this.selectedAccounts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'username': return compare(a.username, b.username, isAsc);
        default: return 0;
      }
    });
  }

  public sortDataUnselected(sort: Sort): void {
    const data = this.unselectedAccounts.slice();
    if (!sort.active || sort.direction === '') {
      this.unselectedAccounts = data;
      return;
    }

    this.sortIDUnsorted = sort.active;
    this.sortDirUnsorted = sort.direction.toUpperCase();
    this.getAccounts();
  }
}
