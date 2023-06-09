import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { AdminService } from '../../../services/admin/admin.service';
import { forkJoin } from 'rxjs';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { LANG_MAP } from 'src/data/consts';
import { FormControl, Validators } from '@angular/forms';

@Component({
  providers: [CompanyService],
  selector: 'edit-user',
  templateUrl: './edit-user.html',
})
export class EditUserData {
  public user: any = {};
  public userCopy: any = { kyc_validations: {} };
  public loading = false;
  public error = '';
  public lang: any = 'esp';
  public prefix = new FormControl('', Validators.pattern(/^[0-9]*$/));
  public phone = new FormControl('', Validators.pattern(/^[0-9]*$/));

  public langMap = {
    cat: 'ca',
    en: 'en',
    eng: 'en',
    es: 'es',
    esp: 'es',
  };

  public genders = [
    { name: 'MALE', value: 'M' },
    { name: 'FEMALE', value: 'F' },
    { name: 'NON_BINARI', value: 'NB' },
  ];

  constructor(
    public dialogRef: MatDialogRef<EditUserData>,
    public us: UserService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public usersCrud: UsersCrud,
    public alerts: AlertsService,
  ) {}

  public ngOnInit() {
    this.getUser();
    this.prefix.setValue(this.userCopy.prefix);
    this.phone.setValue(this.userCopy.phone);
  }

  public close(user = null): void {
    this.dialogRef.close(JSON.stringify(user));
  }

  public getUser() {
    this.usersCrud.find(this.user.id).subscribe((resp) => {
      this.user = resp.data;
      this.user.kyc_validations.lastName = this.user.kyc_validations.last_name;
      this.user.locale = LANG_MAP[this.user.locale] || LANG_MAP.es;
      this.lang = this.langMap[this.user.locale];
      this.userCopy = { ...this.user };
      this.userCopy.kyc_validations = { ...this.user.kyc_validations };
    });
  }

  public async update() {
    const id = this.user.id;
    const kycId = this.user.kyc_validations && this.user.kyc_validations.id;

    const changedProps: any = this.utils.deepDiff(this.userCopy, this.user);
    const changedPropsKyc: any = this.utils.deepDiff(this.userCopy.kyc_validations, this.user.kyc_validations);

    delete changedProps.kyc_validations;

    // deepDiff seems to modify objects into arrays
    // so we set it from userCopy
    if (changedProps.locale && this.userCopy.locale) {
      changedProps.locale = this.langMap[this.userCopy.locale.abrev];
    }

    if (changedPropsKyc.date_birth) {
      changedPropsKyc.date_birth = new Date(changedPropsKyc.date_birth).toISOString();
    }

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
        try {
          await this.adminService
            .updateUserPhone(id, changedProps.prefix, changedProps.phone)
            .toPromise()
            .then(() => {
              return this.alerts.showSnackbar('PHONE_CHANGED', 'ok');
            });
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (error) {
          return this.alerts.showSnackbar(error.message, 'ok');
        }
      } else {
        return;
      }
      delete changedProps.prefix;
      delete changedProps.phone;
    }

    if (kycId && Object.keys(changedPropsKyc).length) {
      promises.push(this.adminService.updateUserKyc(kycId, changedPropsKyc));
    }

    if (promises.length) {
      forkJoin(promises).subscribe(
        (resp) => {
          this.alerts.showSnackbar('SAVED_CORRECTLY', 'ok');
          this.close();
        },
        (error) => {
          this.alerts.showSnackbar(error.message, 'ok');
          this.close();
        },
      );
    } else {
      this.alerts.showSnackbar('NO_UPDATE', 'ok');
    }
  }

  public confirmChangePhone() {
    return this.alerts
      .showConfirmation(`CHANGE_PHONE_DESC`, {}, 'Change phone for user ' + this.user.name, {
        btnConfirmText: 'Change',
        status: 'error',
      })
      .toPromise();
  }

  public setLanguage($event) {
    this.userCopy.locale = this.lang = $event;
  }
}
