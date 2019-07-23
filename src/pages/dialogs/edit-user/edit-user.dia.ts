import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company/company.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { UtilsService } from '../../../services/utils/utils.service';
import { Observable } from 'rxjs';
import { FileUpload } from '../../../components/dialogs/file-upload/file-upload.dia';
import { ConfirmationMessage } from '../../../components/dialogs/confirmation-message/confirmation.dia';
import { AdminService } from '../../../services/admin/admin.service';
import { forkJoin } from 'rxjs';

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

  constructor(
    public dialogRef: MatDialogRef<EditUserData>,
    public snackBar: MySnackBarSevice,
    public us: UserService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public utils: UtilsService,
    public dialog: MatDialog,
  ) { }

  public ngOnInit() {
    // this.userCopy = Object.assign({}, this.user);
    // this.userCopy.kyc_validations = Object.assign({}, this.user.kyc_validations);
    this.getUser();
  }

  public close(user = null): void {
    this.dialogRef.close(JSON.stringify(user));
  }

  public getUser() {
    this.adminService.getUserV3(this.user.id)
      .subscribe((resp) => {
        console.log('Got user', resp);
        this.user = resp.data;
        this.userCopy = { ...this.user };
        this.userCopy.kyc_validations = { ...this.user.kyc_validations };
      });
  }

  public async update() {
    const id = this.user.id;
    const kycId = this.user.kyc_validations.id;
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
      promises.push(this.adminService.updateUser(id, changedProps));
    }

    if (changedProps.prefix || changedProps.phone) {
      const resp = await this.confirmChangePhone();
      if (resp) {
        await this.adminService.updateUserPhone(id, changedProps.prefix, changedProps.phone)
          .toPromise()
          .then((update) => {
            this.snackBar.open('Phone number changed correctly (needs to be validated)', 'ok');
          })
          .catch((err) => {
            this.snackBar.open(err._body.message, 'ok');
          });
      }
      delete changedProps.prefix;
      delete changedProps.phone;
    }

    if (Object.keys(changedPropsKyc).length) {
      promises.push(this.adminService.updateUserKyc(kycId, changedPropsKyc));
    }

    if (promises.length) {
      forkJoin(promises).subscribe((resp) => {
        this.snackBar.open('Saved correctly', 'ok');
        this.close();
      }, (error) => {
        this.snackBar.open(error._body.message, 'ok');
        this.close();
      });
    }
  }

  public confirmChangePhone() {
    const dialogRef = this.dialog.open(ConfirmationMessage);

    dialogRef.componentInstance.status = 'error';
    dialogRef.componentInstance.title = 'Change phone for user ' + this.user.name;
    dialogRef.componentInstance.message = `CHANGE_PHONE_DESC`;
    dialogRef.componentInstance.btnConfirmText = 'Change';

    return dialogRef.afterClosed().toPromise();
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
    const dialogRef = this.dialog.open(FileUpload);
    dialogRef.componentInstance.selectedImage = selectedImage;
    dialogRef.componentInstance.hasSelectedImage = !!selectedImage;
    return dialogRef.afterClosed();
  }
}
