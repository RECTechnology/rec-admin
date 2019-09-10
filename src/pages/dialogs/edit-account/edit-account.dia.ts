import { Component } from '@angular/core';
import { MatDialogRef, MatDialog, throwToolbarMixedModesError } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company/company.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { UtilsService } from '../../../services/utils/utils.service';
import { FileUpload } from '../../../components/dialogs/file-upload/file-upload.dia';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../../services/admin/admin.service';
import { MapsAPILoader } from '@agm/core';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';

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
  public lang = 'esp';

  public currentTab = 0;

  public viewManageSchedule = false;
  public viewManageOffers = false;

  public schedule = '';
  public error: string;
  public loading: boolean;

  public langMap = {
    cat: 'cat',
    en: 'eng',
    es: 'esp',
  };

  public geocoder: any;
  public productList: any[] = [];
  public actQuery = '';

  public activities = [];
  public activitiesSelected = [];

  constructor(
    public dialogRef: MatDialogRef<EditAccountData>,
    public snackBar: MySnackBarSevice,
    public utils: UtilsService,
    public us: UserService,
    public dialog: MatDialog,
    public translate: TranslateService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public crudAccounts: AccountsCrud,
    public productsCrud: ProductsCrud,
    public activitiesCrud: ActivitiesCrud,
    public snackbar: MySnackBarSevice,
  ) {
    this.lang = this.langMap[us.lang];
    this.companyService.listCategories()
      .subscribe((resp) => {
        this.companyService.categories = resp.data;
      });

    this.productsCrud.list({ limit: 300 })
      .subscribe((resp) => {
        this.productList = resp.data.elements;
      });

    this.activitiesCrud.list({ limit: 300 })
      .subscribe((resp) => {
        this.activities = resp.data.elements;
      });
  }

  public ngOnInit() {
    this.type = this.account.type;
    this.account.neighbourhood_id = this.account.neighbourhood ? this.account.neighbourhood.id : null;
    this.accountCopy = { ...this.account };
    this.schedule = this.utils.parseSchedule(this.account.schedule);
    delete this.accountCopy.kyc_validations;
  }

  public addActivity(act) {
    this.loading = true;
    this.activitiesSelected.push(act);
    this.crudAccounts.addActivity(this.account.id, act.id)
      .subscribe((resp) => {
        this.snackbar.open('Removed activity', 'ok');
        this.loading = false;
      }, (error) => {
        this.snackbar.open(error.message, 'ok');
        this.loading = false;
      });
  }

  public addConsumed(product) {
    this.loading = true;
    this.account.consuming_products.push(product);
    this.crudAccounts.addConsumedProductToAccount(this.account.id, product.id)
      .subscribe((resp) => {
        this.snackbar.open('Added product', 'ok');
        this.loading = false;
      }, (error) => {
        this.snackbar.open(error.message, 'ok');
        this.loading = false;
      });
  }

  public addProduced(product) {
    this.loading = true;
    this.account.producing_products.push(product);
    this.crudAccounts.addProducedProductToAccount(this.account.id, product.id)
      .subscribe((resp) => {
        this.snackbar.open('Added product', 'ok');
        this.loading = false;
      }, (error) => {
        this.snackbar.open(error.message, 'ok');
        this.loading = false;
      });
  }

  public deleteActivity(i) {
    this.loading = true;
    const act = this.activitiesSelected[i];
    this.activitiesSelected.splice(i, 1);
    this.crudAccounts.deleteActivity(this.account.id, act.id)
      .subscribe((resp) => {
        this.snackbar.open('Removed activity', 'ok');
        this.loading = false;
      }, (error) => {
        this.snackbar.open(error.message, 'ok');
        this.loading = false;
      });

  }

  public deleteConsumed(i) {
    this.loading = true;

    const act = this.account.consuming_products[i];
    this.account.consuming_products.splice(i, 1);
    this.crudAccounts.removeConsumedProductToAccount(this.account.id, act.id)
      .subscribe((resp) => {
        this.snackbar.open('Removed product', 'ok');
        this.loading = false;
      }, (error) => {
        this.snackbar.open(error.message, 'ok');
        this.loading = false;
      });
  }

  public deleteProduced(i) {
    this.loading = true;

    const act = this.account.producing_products[i];
    this.account.producing_products.splice(i, 1);
    this.crudAccounts.removeProducedProductToAccount(this.account.id, act.id)
      .subscribe((resp) => {
        this.snackbar.open('Removed product', 'ok');
        this.loading = false;
      }, (error) => {
        this.snackbar.open(error.message, 'ok');
        this.loading = false;
      });
  }

  public close(account = {}): void {
    this.dialogRef.close(JSON.stringify(account));
  }

  public nameMatches(name: string) {
    return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
  }

  public update() {
    const id = this.account.id;
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);

    const schedule = this.utils.constructScheduleString(this.schedule);
    if (schedule !== this.account.schedule) {
      changedProps.schedule = schedule;
    }

    if (Object.keys(changedProps).length) {
      this.loading = true;
      this.crudAccounts.update(id, changedProps)
        .subscribe(
          (resp) => {
            this.snackBar.open('Updated account correctly!', 'ok');
            this.loading = false;
            this.close(this.account);
          }, (error) => {
            this.snackBar.open('Error updating account! ' + error.message, 'ok');
            this.loading = false;
            this.close(this.account);
          });
    } else {
      this.snackBar.open('Nothing to update', 'ok');
    }
  }

  public saveImages() {
    // /manager/v1/groups/1176/image
  }

  public selectPublicImage() {
    this.openUpdateImage(this.account.public_image)
      .subscribe((resp) => {
        this.accountCopy.public_image = resp;
      }, (error) => {
        this.snackBar.open(error.message);
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
    const dialogRef = this.dialog.open(FileUpload);
    dialogRef.componentInstance.selectedImage = selectedImage;
    dialogRef.componentInstance.hasSelectedImage = !!selectedImage;
    return dialogRef.afterClosed();
  }

  public manageSchedule() {
    this.viewManageOffers = false;
    this.viewManageSchedule = true;
    this.currentTab = 3;
  }

  public manageOffers() {
    this.viewManageSchedule = false;
    this.viewManageOffers = true;
    this.currentTab = 3;
  }

  public setType(type) {
    this.accountCopy.type = type;

    if (type === 'COMPANY') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_COMPANY[0];
    } else if (type === 'PRIVATE') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_PRIVATE[0];
    }
  }
}
