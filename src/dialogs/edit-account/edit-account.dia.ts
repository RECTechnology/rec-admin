import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company/company.service';
import { UtilsService } from '../../services/utils/utils.service';
import { FileUpload } from '../../components/dialogs/file-upload/file-upload.dia';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../services/admin/admin.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { LANG_MAP } from 'src/data/consts';
import { Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, map, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  providers: [
    CompanyService,
  ],
  selector: 'edit-account',
  templateUrl: './edit-account.html',
})
export class EditAccountData {
  public account: any = {};
  public accountCopy: any = {};
  public title: string = 'EDIT_ACCOUNT';
  public ACCOUNT_TYPES = ['PRIVATE', 'COMPANY'];
  public ACCOUNT_SUB_TYPES_PRIVATE = ['NORMAL', 'BMINCOME'];
  public ACCOUNT_SUB_TYPES_COMPANY = ['WHOLESALE', 'RETAILER'];
  public type = 'PRIVATE';
  public lang: any = 'esp';
  public currentTab = 0;
  public viewManageSchedule = false;
  public viewManageOffers = false;
  public schedule = '';
  public error: string;
  public loading: boolean;
  public langMap = {
    cat: 'ca',
    en: 'en',
    eng: 'en',
    es: 'es',
    esp: 'es',
  };
  public geocoder: any;
  public productList: any[] = [];
  public actQuery = '';
  public prodQuery = '';
  public actMainQuery = '';
  public activities = [];
  public activitiesSelected = [];
  public validationErrors: any = [];
  public validationErrorName = '';
  public isSearching = false;

  @ViewChild('searchConsumed', { static: true }) public searchConsumed: ElementRef;
  @ViewChild('searchProduced', { static: true }) public searchProduced: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<EditAccountData>,
    public utils: UtilsService,
    public us: UserService,
    public dialog: MatDialog,
    public translate: TranslateService,
    public companyService: CompanyService,
    public crudAccounts: AccountsCrud,
    public productsCrud: ProductsCrud,
    public activitiesCrud: ActivitiesCrud,
    public alerts: AlertsService,
    public as: AdminService,
  ) {
    this.lang = this.langMap[us.lang];
    this.companyService.listCategories()
      .subscribe((resp) => {
        this.companyService.categories = resp.data;
      });

    this.productsCrud.search({ limit: 300, sort: 'name', order: 'asc' }, this.lang)
      .subscribe((resp) => this.productList = resp.data.elements);

    this.activitiesCrud.list({ limit: 300, sort: 'name', order: 'asc' }, this.lang)
      .subscribe((resp) => this.activities = resp.data.elements);
  }

  public getProducts() {
    this.productsCrud.search({ limit: 50, sort: 'name', order: 'asc', search: this.prodQuery }, this.lang)
      .subscribe((resp) => {
        this.productList = resp.data.elements;
        this.isSearching = false;
      });
  }

  public ngOnInit() {
    this.type = this.account.type;

    this.account.neighbourhood_id = this.account.neighbourhood ? this.account.neighbourhood.id : null;

    if (this.account.activity_main) {
      this.account.activity_main_id = this.account.activity_main.id;
    } else {
      this.account.activity_main_id = 'none';
      this.account.activity_main = { id: 'none' };
    }

    this.account.kyc_manager.locale = LANG_MAP[this.account.kyc_manager.locale];

    this.accountCopy = { ...this.account };
    this.activitiesSelected = this.accountCopy.activities.slice();
    this.schedule = this.utils.parseSchedule(this.account.schedule);
    delete this.accountCopy.kyc_validations;

    this.setupDebounce(this.searchConsumed.nativeElement);
    this.setupDebounce(this.searchProduced.nativeElement);
  }

  public setupDebounce(element) {
    fromEvent(element, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(100),
      distinctUntilChanged(),
    ).subscribe((text: string) => {
      this.prodQuery = text;
      this.isSearching = true;
      this.getProducts();
    });
  }

  public addMainActivity(act_id) {
    this.accountCopy.activity_main_id = act_id;
    this.accountCopy.activity_main.id = act_id;
    this.update(false);
  }

  public addActivity(act) {
    this.loading = true;
    this.activitiesSelected.push(act);
    this.crudAccounts.addActivity(this.account.id, act.id)
      .subscribe(() => {
        this.alerts.showSnackbar('Added activity', 'ok');
        this.loading = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      });
  }

  public addConsumed(product) {
    this.loading = true;
    this.account.consuming_products.push(product);
    this.crudAccounts.addConsumedProductToAccount(this.account.id, product.id)
      .subscribe(() => {
        this.alerts.showSnackbar('Added product', 'ok');
        this.loading = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      });
  }

  public addProduced(product) {
    this.loading = true;
    this.account.producing_products.push(product);
    this.crudAccounts.addProducedProductToAccount(this.account.id, product.id)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Added product', 'ok');
        this.loading = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      });
  }

  public deleteActivity(i) {
    this.loading = true;
    const act = this.activitiesSelected[i];
    this.activitiesSelected.splice(i, 1);
    this.crudAccounts.deleteActivity(this.account.id, act.id)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Removed activity', 'ok');
        this.loading = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      });

  }

  public setLanguage($event) {
    this.accountCopy.locale = $event.abrev;
  }

  public deleteConsumed(i) {
    this.loading = true;

    const act = this.account.consuming_products[i];
    this.account.consuming_products.splice(i, 1);
    this.crudAccounts.removeConsumedProductFromAccount(this.account.id, act.id)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Removed product', 'ok');
        this.loading = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      });
  }

  public deleteProduced(i) {
    this.loading = true;

    const act = this.account.producing_products[i];
    this.account.producing_products.splice(i, 1);
    this.crudAccounts.removeProducedProductFromAccount(this.account.id, act.id)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Removed product', 'ok');
        this.loading = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      });
  }

  public close(account = {}): void {
    this.dialogRef.close(JSON.stringify(account));
  }

  public nameMatches(name: string) {
    return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
  }

  public matchesActivity(act, query) {
    const toLower = (str: string) => str.toLowerCase();
    const queryLower = toLower(query);

    return toLower(act.name).includes(queryLower)
      || toLower(act.name_es).includes(queryLower)
      || toLower(act.name_ca).includes(queryLower);
  }

  public trackByFn(i, item) {
    return item.id;
  }

  public update(close = true) {
    const id = this.account.id;
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);

    const schedule = this.utils.constructScheduleString(this.schedule);
    if (schedule !== this.account.schedule) {
      changedProps.schedule = schedule;
    }

    delete changedProps.activity_main;

    if (Object.keys(changedProps).length) {
      this.loading = true;
      this.crudAccounts.update(id, changedProps)
        .subscribe(
          (resp) => {
            this.alerts.showSnackbar('Updated account correctly!', 'ok');
            this.loading = false;
            this.account = resp.data;
            this.ngOnInit();

            if (close) { this.close(this.account); }
          }, (error) => {
            if (error.message.includes('Validation error')) {
              this.validationErrors = error.errors;
            } else {
              this.alerts.showSnackbar('Error updating account! ' + error.message, 'ok');
            }
            this.loading = false;
          });
    } else {
      this.alerts.showSnackbar('Nothing to update', 'ok');
    }
  }

  public selectPublicImage() {
    this.openUpdateImage(this.account.public_image)
      .subscribe((resp) => {
        this.accountCopy.public_image = resp;
      }, (error) => {
        this.alerts.showSnackbar(error.message);
      });
  }

  public selectOrgImage() {
    this.openUpdateImage(this.account.company_image)
      .subscribe((resp) => {
        this.accountCopy.company_image = resp;
      }, (error) => {
        return;
      });
  }

  public openUpdateImage(selectedImage) {
    return this.alerts.openModal(FileUpload, {
      hasSelectedImage: !!selectedImage,
      selectedImage,
    });
  }

  public manageSchedule() {
    this.viewManageOffers = false;
    this.viewManageSchedule = true;
    this.currentTab = 4;
  }

  public manageOffers() {
    this.viewManageSchedule = false;
    this.viewManageOffers = true;
    this.currentTab = 4;
  }

  public setType(type) {
    this.accountCopy.type = type;
    if (type === 'COMPANY') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_COMPANY[0];
    } else if (type === 'PRIVATE') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_PRIVATE[0];
    }
  }

  public changeMapVisibility(id, visible, i) {
    this.loading = true;
    this.as.setMapVisibility(id, visible.checked)
      .subscribe(
        (resp) => {
          this.alerts.showSnackbar(visible.checked
            ? 'Organization is shown in map'
            : 'Organization is hidden from map', 'ok',
          );
          this.loading = false;
        },
        (error) => {
          this.alerts.showSnackbar(error.message, 'ok');
          this.loading = false;
        },
      );
  }

  public onSearch(terms: Observable<string>) {
    return debounceTime(400);
  }

}
