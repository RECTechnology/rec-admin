import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import BaseDialog from "src/bases/dialog-base";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Subscription } from 'rxjs/internal/Subscription';
import { AlertsService } from "src/services/alerts/alerts.service";
import { SaveChangesMessage } from '../other/save-changes/save-changes.dia';
import { CampaignsCrud } from '../../services/crud/campaigns/campaigns.service';
import { AccountsCrud } from '../../services/crud/accounts/accounts.crud';
import { Account } from "src/shared/entities/account.ent";
import { GenericDialog } from '../other/generic-dialog/generic-dialog';



@Component({
    selector: 'add-campaign',
    templateUrl: './add-campaign.dia.html',
    styleUrls: ['./add-campaign.dia.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
      }]
  })

  export class AddCampaignDia extends BaseDialog implements OnInit, OnDestroy {
    public managerAccount: Account;
    public isEdit: boolean = false;
    public isLinear: boolean = true;
    public edited: boolean = false;
    public updated: boolean = false;
    public validationErrors: ValidationErrors[];
    public imageWidth: number = 500;
    public imageHeight: number = 500;
    public init_date: string;
    public version: number = null;
    public end_date: string;
    public campaignId: number;
    private subscription: Subscription;
    public campaignData: any = {};
    public pageArrays: any = [];
    public campaign: any = {
      id: null,
      init_date: null,
      end_date: null,
      name: null,
      min: null,
      max: null,
      campaign_account: null,
      reedemable_percentage: null,
      image_url: null,
      video_promo_url: null,
      url_tos: null,
      bonus_ending_threshold: null
    }

    @ViewChild('stepper') stepper: MatStepper;

    public formGroup: FormGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          url_tos: ['', [Validators.required, Validators.pattern(/^((http|https|ftp):\/\/)/)]],
          name: [''],
          redeemable_percentage: [null, [Validators.required, Validators.min(1)]],
          init_date:[null, Validators.required],
          end_date:[null, Validators.required]
        }),
        this.fb.group({
          min: [null, [Validators.required, Validators.min(0)]],
          max: [null, [Validators.required, Validators.min(0.01)]],
          campaign_account: [null, Validators.required]
        }),
        this.fb.group({
          image_url: [''],
          video_promo_url: ['', Validators.pattern(/^((http|https|ftp):\/\/)/)],
          promo_url: ['', Validators.pattern(/^((http|https|ftp):\/\/)/)]
        }),
        this.fb.group({
          bonus_ending_threshold: [null, [Validators.required,Validators.min(1e-12)]],
        }),
      ])
    });

    constructor(
        public dialogRef: MatDialogRef<AddCampaignDia>,
        public fb: FormBuilder,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public crud: CampaignsCrud,
        public accountsCrud: AccountsCrud
      ) {
        super();
        dialogRef.disableClose = true;
      }
    
    ngOnInit(): void{
      this.ifIsEditManageCampaigData(true);
      if(this.isEdit){
        this.isLinear = false;
      }
    }
    
    ngOnDestroy(): void{
      this.dialogRef.close(this.updated);
      if(this.isEdit){
        this.subscription.unsubscribe();
      }
    }

    get formArray(): AbstractControl | null {
      return this.formGroup.get('formArray');
    }

    nextStep(){
      if(!(this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].valid){
        (this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].markAllAsTouched();
        return;
      }else {
        this.stepper.next();
      }
    }

    moveStep(index: number) {

      if(!(this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].valid){
        (this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].markAllAsTouched();
        return;
      };

      if(this.isEdit && this.edited && (this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].valid){
        const dialogRef = this.dialog.open(SaveChangesMessage, { disableClose: true });
        dialogRef.afterClosed().subscribe((resp) => {
          if (resp.confirmed && resp.action === 'save') {
            this.save(index);
            this.stepper.selectedIndex = index;
          }
          if(resp.confirmed && resp.action === 'not-save'){
            (this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].patchValue(this.pageArrays[this.stepper.selectedIndex]);
            this.subscription.unsubscribe();
            this.edited = false;
            this.stepper.selectedIndex = index;
            this.validation(index);
          }
        });
      }else if(this.isEdit && !this.edited) {
        if(this.subscription){
          this.subscription.unsubscribe();
        }
        this.validation(index);
        this.stepper.selectedIndex = index;
      }else {
        this.stepper.selectedIndex = index;
      }
    }

    public changeStartDate(event) {
      var dateSupport: Date = new Date(event.target.value);
      var datepipe: DatePipe = new DatePipe('es');
      (this.formGroup.controls.formArray as FormGroup).controls[0].get('init_date').setValue(datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss'));
      if(this.isEdit){
        this.pageArrays[0].init_date = datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss');
      }
      this.init_date = dateSupport.toISOString();
    }

    public changeFinishDate(event) {
      var dateSupport: Date = new Date(event.target.value);
      var datepipe: DatePipe = new DatePipe('es');
      (this.formGroup.controls.formArray as FormGroup).controls[0].get('end_date').setValue(datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss'));
      if(this.isEdit){
        this.pageArrays[0].end_date = datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss');
      }
      this.end_date = dateSupport.toISOString();
    }

    public validation( index: number) {
      this.subscription = (this.formGroup.controls.formArray as FormGroup).controls[index].valueChanges
        .subscribe( resp => {
            (this.edited = Object.keys(this.pageArrays[index]).some(key => resp[key] != 
            (this.pageArrays[index][key])));  
        })
    }

    public create(){
      this.loading = true;
      this.manageCampaignData();
      
      this.crud.create(this.campaignData).subscribe(resp => {
        if(resp){
          this.dialogRef.close(true);
          this.alerts.showSnackbar('CAMPAIGN_CREATED_SUCCESSFULLY');
        }
      }, (error) => {
        this.loading = false;
        if(error.message){
          this.alerts.showSnackbar(error.message); 
          this.validationErrors.push(error);
        }
      })
    }

    public formatDate(date: string){
      var datepipe: DatePipe = new DatePipe('es');
      var dateItem = new Date(date);
      return datepipe.transform(dateItem, 'yyyy-MM-ddTHH:mm:ss');
    }

    public convertToRecs(number: number){
      return number /1e8;
    }

    public convertToSatoshis(number: number){
      return number *1e8;
    }

    public getUpdatedCampaignData(index: number){
      this.loading = true;
      this.crud.find(this.campaignId).subscribe( resp => {
        if(resp){
          this.pageArrays = [
            this.getCampaignDataToEdit(resp.data, ['name', 'url_tos', 'init_date', 'end_date', 'redeemable_percentage']),
            this.getCampaignDataToEdit(resp.data, ['min', 'max', 'campaign_account']),
            this.getCampaignDataToEdit(resp.data, ['image_url', 'promo_url', 'video_promo_url']),
            this.getCampaignDataToEdit(resp.data, ['bonus_ending_threshold']),
          ];
          this.ifIsEditManageCampaigData(false, index);
          
        }
      }, (error) => {
        if(error.message){
          this.alerts.showSnackbar(error.message);
          this.validationErrors.push(error);
          this.loading = false;
        }
      })
    }

    public save(index?: number){
      this.loading = true;

      if(!(this.formGroup.controls.formArray as FormGroup).controls[this.stepper.selectedIndex].valid){
        this.alerts.showSnackbar('CANNOT_SAVE_WITH_INCORRECT_DATA');
        this.loading = false;
        return;
      }

      this.manageCampaignData();

      this.crud.update(this.campaignId, this.campaignData[this.stepper.selectedIndex]).subscribe( resp => {
        if(resp) {
          this.getUpdatedCampaignData(index);
          this.updated = true;
          this.alerts.showSnackbar('CAMPAIGN_UPDATED_SUCCESSFULLY');
        }
        this.loading = false;
      }, (error) => {
        console.log('errir', error);
        this.loading = false;
        if(error.errors){
          this.alerts.showSnackbar(error.errors[0].message);
        }
        else if(error.message){
          this.alerts.showSnackbar(error.message);
          this.validationErrors.push(error);
        }
      });
    }

    public ifIsEditManageCampaigData(validate:boolean, index?: number){
      if(this.isEdit){
        if(this.version != 0){
          this.pageArrays[1].min = this.convertToRecs(this.pageArrays[1].min);
          this.pageArrays[1].max = this.convertToRecs(this.pageArrays[1].max);
        }
        this.pageArrays[3].bonus_ending_threshold = this.convertToRecs(this.pageArrays[3].bonus_ending_threshold);
        
        for(let i = 0; i < this.pageArrays.length; i++){
          (this.formGroup.controls.formArray as FormGroup).controls[i].patchValue({
            ...this.pageArrays[i]
          })
        }

        (this.formGroup.controls.formArray as FormGroup).controls[0].patchValue({
          'init_date': this.formatDate((this.formGroup.controls.formArray as FormGroup).controls[0].get('init_date').value),
          'end_date': this.formatDate((this.formGroup.controls.formArray as FormGroup).controls[0].get('end_date').value),
        })

        this.pageArrays[0].init_date = this.formatDate((this.formGroup.controls.formArray as FormGroup).controls[0].get('init_date').value);
        this.pageArrays[0].end_date = this.formatDate((this.formGroup.controls.formArray as FormGroup).controls[0].get('end_date').value);

        this.accountsCrud.find((this.formGroup.controls.formArray as FormGroup).controls[1].get('campaign_account').value).subscribe( account => {
          if(account){
            (this.formGroup.controls.formArray as FormGroup).controls[1].get('campaign_account').setValue(account.data);
            this.pageArrays[1].campaign_account = account.data;
            this.managerAccount = account.data;
            if(!validate){
              this.edited = false;
              this.loading = false;
              if(index){
                this.subscription.unsubscribe();
                this.validation(index);
              }
            }
          }
        })
        if(validate){
          this.validation(0);
        }
      }
    }

    public manageCampaignData(){
      if(this.isEdit){
        this.campaignData = [{...(this.formGroup.controls.formArray as FormGroup).value[0]}, 
          {...(this.formGroup.controls.formArray as FormGroup).value[1]}, 
          {...(this.formGroup.controls.formArray as FormGroup).value[2]},
          {...(this.formGroup.controls.formArray as FormGroup).value[3]}]

        if(this.campaignData[1].campaign_account){
          this.campaignData[1].campaign_account = this.campaignData[1].campaign_account.id;
        }
      
        if(this.campaignData[0].init_date){
          this.campaignData[0].init_date = this.init_date;
        }
      
        if(this.campaignData[0].end_date){
          this.campaignData[0].end_date = this.end_date;
        } 

        if(this.campaignData[3].bonus_ending_threshold){
          this.campaignData[3].bonus_ending_threshold = this.convertToSatoshis(this.campaignData[3].bonus_ending_threshold);
        } 
        if(this.version != 0){
          if(this.campaignData[1].max){
            this.campaignData[1].max = this.convertToSatoshis(this.campaignData[1].max);
          } 
          if(this.campaignData[1].min){
            this.campaignData[1].min = this.convertToSatoshis(this.campaignData[1].min);
          } 
        }

      }else{
        this.campaignData = {...(this.formGroup.controls.formArray as FormGroup).value[0], 
          ...(this.formGroup.controls.formArray as FormGroup).value[1], 
          ...(this.formGroup.controls.formArray as FormGroup).value[2],
          ...(this.formGroup.controls.formArray as FormGroup).value[3]}

          if(this.campaignData.campaign_account){
            this.campaignData.campaign_account = this.campaignData.campaign_account.id;
          }
        
          if(this.campaignData.init_date){
            this.campaignData.init_date = this.init_date;
          }
        
          if(this.campaignData.end_date){
            this.campaignData.end_date = this.end_date;
          } 

          if(this.campaignData.bonus_ending_threshold){
            this.campaignData.bonus_ending_threshold = this.convertToSatoshis(this.campaignData.bonus_ending_threshold);
          }
          if(this.version != 0){
            if(this.campaignData.max){
              this.campaignData.max = this.convertToSatoshis(this.campaignData.max);
            } 
            if(this.campaignData.min){
              this.campaignData.min = this.convertToSatoshis(this.campaignData.min);
            } 
          }

          this.campaignData = {...this.campaignData, tos: '', bonus_enabled: 1, balance: 0}
      }
    }

    public openInfoDialog(){
      const dialogRef = this.dialog.open(GenericDialog, { disableClose: false });
      dialogRef.componentInstance.title = 'INFORMATION';
      dialogRef.componentInstance.message = 'CAMPAIGN_VIDEO_URL_INFORMATION_MESSAGE';
      dialogRef.componentInstance.status = 'yellow'
    }

    public getCampaignDataToEdit(campaign, data: string[]){
      return Object.keys(campaign).reduce(function(result, key) {
        data.map(copyKey => {
          if(key && data.includes(key)){
            result[key] = campaign[key]
          }
          if(!Object.keys(campaign).includes(copyKey)){
            result[copyKey] = "";
          }
        })
        return result
      }, {})
    }
  }