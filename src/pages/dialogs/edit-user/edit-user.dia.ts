import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { FileUpload } from '../../../components/dialogs/file-upload/file-upload.dia';
import { AdminService } from '../../../services/admin/admin.service';
import { forkJoin } from 'rxjs';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { LANG_MAP } from 'src/data/consts';

@Component({
  providers: [
    CompanyService,
  ],
  selector: 'edit-user',
  templateUrl: './edit-user.html',
})
export class EditUserData {
  public user: any = {};
  public userCopy: any = { kyc_validations: {} };
  public loading = false;
  public error = '';
  public lang: any = 'esp';

  public langMap = {
    cat: 'ca',
    en: 'en',
    eng: 'en',
    es: 'es',
    esp: 'es',
  };

  constructor(
    public dialogRef: MatDialogRef<EditUserData>,
    public us: UserService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public usersCrud: UsersCrud,
    public alerts: AlertsService,
  ) {
    // this.lang = this.langMap[us.lang];
  }

  public ngOnInit() {
    this.getUser();
  }

  public close(user = null): void {
    this.dialogRef.close(JSON.stringify(user));
  }

  public getUser() {
    this.usersCrud.find(this.user.id)
      .subscribe((resp) => {
        this.user = resp.data;
        this.user.kyc_validations.lastName = this.user.kyc_validations.last_name;
        console.log('Locale', this.user.locale);
        this.user.locale = LANG_MAP[this.user.locale] || LANG_MAP['es'];
        this.lang = this.langMap[this.user.locale];

        console.log('Locale', this.user.locale);

        this.userCopy = { ...this.user };
        this.userCopy.kyc_validations = { ...this.user.kyc_validations };
      });
  }

  public async update() {
    const id = this.user.id;
    const kycId = this.user.kyc_validations && this.user.kyc_validations.id;
    const data = this.userCopy;

    const changedProps: any = this.utils.deepDiff(data, this.user);
    const changedPropsKyc: any = this.utils.deepDiff(data.kyc_validations, this.user.kyc_validations);

    delete changedProps.kyc_validations;

    if (changedPropsKyc.last_name) {
      changedPropsKyc.lastName = changedPropsKyc.last_name;
      delete changedPropsKyc.last_name;
    }

    const promises = [];
    if (Object.keys(changedProps).length) {
      promises.push(this.usersCrud.update(id, changedProps));
    }

    if (changedProps.prefix || changedProps.phone) {
      const resp = await this.confirmChangePhone();
      if (resp) {
        await this.adminService.updateUserPhone(id, changedProps.prefix, changedProps.phone)
          .toPromise()
          .then(() => {
            this.alerts.showSnackbar('Phone number changed correctly (needs to be validated)', 'ok');
          })
          .catch((err) => {
            this.alerts.showSnackbar(err.message, 'ok');
          });
      }
      delete changedProps.prefix;
      delete changedProps.phone;
    }

    if (kycId && Object.keys(changedPropsKyc).length) {
      promises.push(this.adminService.updateUserKyc(kycId, changedPropsKyc));
    }

    if (promises.length) {
      forkJoin(promises).subscribe((resp) => {
        this.alerts.showSnackbar('Saved correctly', 'ok');
        this.close();
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.close();
      });
    } else {
      this.alerts.showSnackbar('Nothing to update', 'ok');
    }
  }

  public confirmChangePhone() {
    return this.alerts.showConfirmation(
      `CHANGE_PHONE_DESC`, 'Change phone for user ' + this.user.name,
      'Change', 'error',
    ).toPromise();
  }

  public selectProfileImage() {
    this.openUpdateImage(this.user.profile_image)
      .subscribe((resp) => {
        this.userCopy.profile_image = resp;
      }, (error) => {
        return;
      });
  }

  public selectDocFront() {
    this.openUpdateImage(this.user.kyc_validations.document_front)
      .subscribe((resp) => {
        this.userCopy.kyc_validations.document_front = resp;
      }, (error) => {
        return;
      });
  }

  public selectDocRear() {
    this.openUpdateImage(this.user.kyc_validations.document_rear)
      .subscribe((resp) => {
        this.userCopy.kyc_validations.document_rear = resp;
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

  public setLanguage($event) {
    this.userCopy.locale = $event;
    // this.user.locale = $event;
    this.lang = $event;
  }
}
