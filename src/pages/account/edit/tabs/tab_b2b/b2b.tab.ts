import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { UserService } from 'src/services/user.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { AddActivityDia } from './AddActivity/addActivity';

@Component({
  selector: 'tab-b2b',
  templateUrl: './b2b.html',
})
export class B2BTab {
  static readonly tabName = 'b2b';

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
  public activityTest: Activity;

  public main_activity = null;
  public main_alone_activity = null;
  public main_alone_activity_id = null;
  public main_activity_id = 'null';
  public activitySelector = null;
  public secondary_activity = null;

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
    public us: UserService,
  ) {
    this.lang = this.langMap[us.lang];

    this.productsCrud
      .search({ limit: 300, sort: 'name', order: 'asc' }, this.lang)
      .subscribe((resp) => (this.productList = resp.data.elements));
  }

  public ngOnInit() {
    this.account.neighbourhood_id = this.account.neighbourhood ? this.account.neighbourhood.id : null;
    this.main_alone_activity = this.account.activity_main ?? null;
    this.main_alone_activity_id = this.main_activity ? this.main_activity.id : null;

    if (this.main_alone_activity) {
      if (this.main_alone_activity.parent != undefined && this.main_alone_activity.parent != null) {
        this.secondary_activity = this.account.activity_main;
        this.main_alone_activity = this.account.activity_main;
      }
    }

    this.activitiesSelected = this.account.activities;
    this.accountCopy = { ...this.account };
    delete this.accountCopy.kyc_validations;

    this.setupDebounce(this.searchConsumed.nativeElement);
    this.setupDebounce(this.searchProduced.nativeElement);
  }

  public selectParentActivity(item) {
    this.main_alone_activity = item;
    this.main_alone_activity_id = this.main_alone_activity ? this.main_alone_activity.id : null;

    this.accountCopy.activity_main_id = item.id;
    // Aqui seteamos secondary_activity a null, para que tengan que volver a seleccionar una subactivity
    // Esto se hace porque cuando se selecciona un parent diferente, las subactivities son otras, por lo que tenemos que resetear el campo
    this.secondary_activity = null;
    this.update();
  }
  public selectActivity(item) {
    this.secondary_activity = item;
    this.accountCopy.activity_main_id = item.id;
    this.update();
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

  public addActivity(act) {
    this.loading = true;
    this.activitiesSelected.push(act);
    this.crudAccounts.addActivity(this.account.id, act.id).subscribe(() => {
      this.alerts.showSnackbar('ADDED_ACTIVITY', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public addActivityModal() {
    this.alerts
      .openModal(AddActivityDia, {
        item: Object.assign({}),
        userId: false,
      })
      .subscribe((updated) => {
        if (updated) {
          if (updated.main_activity != null || updated.secondary_activity != null) {
            this.main_activity = updated.main_activity;
            this.main_activity_id = updated.main_activity ? updated.main_activity.id : null;
            this.secondary_activity = updated.secondary_activity;

            this.accountCopy.activity_main_id = updated.main_activity_id;
            this.crudAccounts
              .addActivity(
                this.account.id,
                this.secondary_activity ? this.secondary_activity.id : this.main_activity_id,
              )
              .subscribe(() => {
                this.alerts.showSnackbar('ADDED_ACTIVITY', 'ok');

                this.activitiesSelected.push(this.secondary_activity ? this.secondary_activity : this.main_activity);
                this.loading = false;
              }, this.alerts.observableErrorSnackbar.bind(this.alerts));
          }
        }
      });
  }

  public addConsumed(product) {
    this.loading = true;
    this.account.consuming_products.push(product);
    this.crudAccounts.addConsumedProductToAccount(this.account.id, product.id).subscribe(() => {
      this.alerts.showSnackbar('ADDED_PRODUCT', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public addProduced(product) {
    this.loading = true;
    this.account.producing_products.push(product);
    this.crudAccounts.addProducedProductToAccount(this.account.id, product.id).subscribe((resp) => {
      this.alerts.showSnackbar('ADDED_PRODUCT', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public deleteActivity(i) {
    this.loading = true;
    const act = this.activitiesSelected[i];
    this.activitiesSelected.splice(i, 1);
    this.crudAccounts.deleteActivity(this.account.id, act.id).subscribe((resp) => {
      this.alerts.showSnackbar('REMOVED_ACTIVITY', 'ok');
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
      this.alerts.showSnackbar('REMOVED_PRODUCT', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public deleteConsumed(i) {
    this.loading = true;

    const act = this.account.consuming_products[i];
    this.account.consuming_products.splice(i, 1);
    this.crudAccounts.removeConsumedProductFromAccount(this.account.id, act.id).subscribe((resp) => {
      this.alerts.showSnackbar('REMOVED_PRODUCT', 'ok');
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
    delete changedProps.kyc_manager;
    delete changedProps.level;
    delete changedProps.category;
    delete changedProps.neighbourhood;
    this.accountChanged.emit(changedProps);
  }
}
