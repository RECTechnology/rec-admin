import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FileUpload } from '../../../../components/dialogs/file-upload/file-upload.dia';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CompanyService } from '../../../../services/company/company.service';
import { InfoMessage } from '../../../../components/dialogs/info-message/info.dia';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';

@Component({
  selector: 'kyc-tier-validation',
  templateUrl: '../../../../pages/account/tab_kyc/tier_validation/tier_validation.html',
})
export class Tier1Form implements OnInit {
  public documentSet: boolean = false;
  public kycUploads: any[] = [];
  public totalKycUploads: number = 0;
  public tierPendingSince: string;
  public tierStatus: string;
  public kycData: any = {};

  public kycFormOpen: any = false;

  @Input() public tier: number = 0;
  @Input() public parent: any = {};
  @Input() public uploadButtons: boolean = true;
  @Input() public showRequirementsList: boolean = true;
  public loading = false;
  constructor(
    public dialog: MatDialog,
    public titleService: Title,
    public route: ActivatedRoute,
    public us: UserService,
    public companyService: CompanyService,
    public snackBar: MySnackBarSevice,
  ) { }

  public setupKYCdata() {
    this.kycData = this.us.userData.kyc_validations;
    this.tierStatus = this.kycData['tier' + this.tier + '_status'];
    this.tierPendingSince = this.kycData['tier' + this.tier + '_status_request'];
  }

  public ngOnInit() {
    this.getUploads();
    this.setupKYCdata();
  }

  public getUploads() {
    this.loading = true;
    this.companyService.getKycUploads()
      .subscribe((resp) => {
        this.kycUploads = resp.data.elements;
        this.totalKycUploads = resp.data.total;
        this.loading = false;
      }, (error) => { this.loading = false; });
  }

  public uploadDocument() {
    let dialogRef = this.dialog.open(FileUpload);
    dialogRef.componentInstance.title = 'Please upload your Tier ' + this.tier;
    dialogRef.componentInstance.noImageName = 'no_image_image';

    dialogRef.afterClosed().subscribe((src) => {
      if (src) {
        this.companyService.uploadKycFile(src, this.tier, 'tier ' + this.tier)
          .subscribe(
            (resp) => {
              const title = 'Your document has been uploaded';
              const message =
                title + ', our team will check it and if everything is fine your KYC TIER will be updated. Thank you.';
              const htmlMessage = `<p class="small-text-2">${message}</p>`;
              const btnMessage = 'Ok';
              this.openShowInfoMessage(htmlMessage, title, false, btnMessage);
              this.getUploads();
            }, (error) => { return; });
      }
      dialogRef = null;
    });
  }

  public requestKycValidation() {
    const title = 'You have requested Tier validation';
    const message =
      title + ', our team will check it and if everything is fine your KYC TIER will be updated. Thank you.';
    const htmlMessage = `<p class="small-text-2">${message}</p>`;
    const btnMessage = 'Ok';
    this.openShowInfoMessage(htmlMessage, title, false, btnMessage);
  }

  public openShowInfoMessage(message, title, code, btnText, btnAction?) {
    let dialogRef = this.dialog.open(InfoMessage);
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.code = code;
    dialogRef.componentInstance.btnText = btnText;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.companyService.requestKycValidation(this.tier)
          .subscribe(
            (resp) => {
              this.us.getProfile()
                .subscribe((profile) => {
                  this.us.userData = profile;
                  this.setupKYCdata();
                  this.tierStatus = 'pending';
                }, (error) => { return; });
            },
            (error) => { return; });
      }
      dialogRef = null;
    });
  }

  public returnBack() {
    this.parent.closeKycValidation();
  }

  public changedPage($evt?) {
    return;
  }
}
