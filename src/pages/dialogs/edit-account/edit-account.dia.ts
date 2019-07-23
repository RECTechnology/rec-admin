import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company/company.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { UtilsService } from '../../../services/utils/utils.service';
import { FileUpload } from '../../../components/dialogs/file-upload/file-upload.dia';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../../services/admin/admin.service';
import { MapsAPILoader } from '@agm/core';

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

  constructor(
    public dialogRef: MatDialogRef<EditAccountData>,
    public snackBar: MySnackBarSevice,
    public utils: UtilsService,
    public us: UserService,
    public dialog: MatDialog,
    public translate: TranslateService,
    public companyService: CompanyService,
    public adminService: AdminService,
  ) {
    this.lang = this.langMap[us.lang];
    this.companyService.listCategories()
      .subscribe((resp) => {
        this.companyService.categories = resp.data;
      });
  }

  public ngOnInit() {
    this.type = this.account.type;
    this.accountCopy = Object.assign({}, this.account);
    this.schedule = this.utils.parseSchedule(this.account.schedule);
    this.accountCopy.categoryId = this.account.category ? this.account.category.id : '';
    delete this.accountCopy.kyc_validations;
  }

  public close(account = {}): void {
    this.dialogRef.close(JSON.stringify(account));
  }

  public update() {
    const id = this.account.id;
    const data = this.accountCopy;
    const changedProps: any = this.utils.deepDiff(data, this.account);

    changedProps.category = changedProps.category || changedProps.categoryId;
    delete changedProps.categoryId;

    if (!changedProps.category) {
      delete changedProps.category;
    }

    const schedule = this.utils.constructScheduleString(this.schedule);
    if (schedule !== this.account.schedule) {
      changedProps.schedule = schedule;
    }

    if (Object.keys(changedProps).length) {
      this.adminService.updateAccount(changedProps, id)
        .subscribe(
          (resp) => {
            this.snackBar.open('Updated account correctly!', 'ok');
            this.close(this.account);
          }, (error) => {
            this.snackBar.open('Error updating account!' + error.message, 'ok');
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
        this.snackBar.open(error._body.message);
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
