import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { UserService } from 'src/services/user.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'tab-b2b',
  templateUrl: './b2b.html',
})
export class B2BTab {
  @Input() public account: any;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();
  @ViewChild('searchConsumed', { static: true }) public searchConsumed: ElementRef;
  @ViewChild('searchProduced', { static: true }) public searchProduced: ElementRef;

  public accountCopy: any = {};
  public error: string;
  public pageName = 'B2B';
  public isSearching = false;
  public productList: any[] = [];
  public prodQuery = '';
  public actQuery = '';
  public actMainQuery = '';
  public activities = [];
  public activitiesSelected = [];
  public lang: any = 'esp';
  public langMap = {
    cat: 'ca',
    en: 'en',
    eng: 'en',
    es: 'es',
    esp: 'es',
  };

  constructor(
    private utils: UtilsService,
    public alerts: AlertsService,
    public crudAccounts: AccountsCrud,
    public productsCrud: ProductsCrud,
    public activitiesCrud: ActivitiesCrud,
    public us: UserService,
  ) {
    this.lang = this.langMap[us.lang];

    this.productsCrud
      .search({ limit: 300, sort: 'name', order: 'asc' }, this.lang)
      .subscribe((resp) => (this.productList = resp.data.elements));

    this.activitiesCrud
      .list({ limit: 300, sort: 'name', order: 'asc' }, this.lang)
      .subscribe((resp) => (this.activities = resp.data.elements));
  }

  public ngOnInit() {
    this.account.neighbourhood_id = this.account.neighbourhood ? this.account.neighbourhood.id : null;

    if (this.account.activity_main) {
      this.account.activity_main_id = this.account.activity_main.id;
    } else {
      this.account.activity_main_id = 'none';
      this.account.activity_main = { id: 'none' };
    }

    this.accountCopy = { ...this.account };
    this.activitiesSelected = this.accountCopy.activities.slice();
    delete this.accountCopy.kyc_validations;

    this.setupDebounce(this.searchConsumed.nativeElement);
    this.setupDebounce(this.searchProduced.nativeElement);
  }

  public setupDebounce(element) {
    fromEvent(element, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
      )
      .subscribe((text: string) => {
        this.prodQuery = text;
        this.isSearching = true;
        this.getProducts();
      });
  }

  public getProducts() {
    this.productsCrud
      .search({ limit: 50, sort: 'name', order: 'asc', search: this.prodQuery }, this.lang)
      .subscribe((resp) => {
        this.productList = resp.data.elements;
        this.isSearching = false;
      });
  }

  public addMainActivity(act_id) {
    this.accountCopy.activity_main_id = act_id;
    this.accountCopy.activity_main.id = act_id;
    this.update();
  }

  public addActivity(act) {
    this.loading = true;
    this.activitiesSelected.push(act);
    this.crudAccounts.addActivity(this.account.id, act.id).subscribe(() => {
      this.alerts.showSnackbar('Added activity', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public addConsumed(product) {
    this.loading = true;
    this.account.consuming_products.push(product);
    this.crudAccounts.addConsumedProductToAccount(this.account.id, product.id).subscribe(() => {
      this.alerts.showSnackbar('Added product', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public addProduced(product) {
    this.loading = true;
    this.account.producing_products.push(product);
    this.crudAccounts.addProducedProductToAccount(this.account.id, product.id).subscribe((resp) => {
      this.alerts.showSnackbar('Added product', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public deleteActivity(i) {
    this.loading = true;
    const act = this.activitiesSelected[i];
    this.activitiesSelected.splice(i, 1);
    this.crudAccounts.deleteActivity(this.account.id, act.id).subscribe((resp) => {
      this.alerts.showSnackbar('Removed activity', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public setLanguage($event) {
    this.accountCopy.locale = $event.abrev;
  }

  public deleteProduced(i) {
    this.loading = true;

    const act = this.account.producing_products[i];
    this.account.producing_products.splice(i, 1);
    this.crudAccounts.removeProducedProductFromAccount(this.account.id, act.id).subscribe((resp) => {
      this.alerts.showSnackbar('Removed product', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public deleteConsumed(i) {
    this.loading = true;

    const act = this.account.consuming_products[i];
    this.account.consuming_products.splice(i, 1);
    this.crudAccounts.removeConsumedProductFromAccount(this.account.id, act.id).subscribe((resp) => {
      this.alerts.showSnackbar('Removed product', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public nameMatches(name: string) {
    return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
  }

  public matchesActivity(act, query) {
    const toLower = (str: string) => str.toLowerCase();
    const queryLower = toLower(query);

    return (
      toLower(act.name).includes(queryLower) ||
      toLower(act.name_es).includes(queryLower) ||
      toLower(act.name_ca).includes(queryLower)
    );
  }

  public trackByFn(i, item) {
    return item.id;
  }

  public update() {
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);
    delete changedProps.activity_main;
    this.accountChanged.emit(changedProps);
  }
}
