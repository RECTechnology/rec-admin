import { AlertsService } from 'src/services/alerts/alerts.service';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';
import { AdminService } from 'src/services/admin/admin.service';
import { Neighborhood } from '../../../../../shared/entities/translatable/neighborhood.ent';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'tab-location',
  templateUrl: './location.html',
})
export class LocationTab {
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public error: string;
  public pageName = 'LOCATION';

  public formGroup = new FormGroup({
    address_number: new FormControl("", Validators.pattern(/^[0-9]*$/)),
    zip: new FormControl("", Validators.pattern(/^[0-9]*$/)),
    street_type: new FormControl(),
    street: new FormControl(""),
    neighbourhood: new FormControl(),
    onMap: new FormControl(),
    latitude: new FormControl(),
    longitude: new FormControl()
  })
  

  constructor(private utils: UtilsService, public alerts: AlertsService, public as: AdminService) {}

  public ngOnInit() {
    this.accountCopy = { ...this.account };
    this.formGroup.get('street_type').setValue(this.accountCopy.street_type),
    this.formGroup.get('neighbourhood').setValue(this.accountCopy.neighbourhood)
  }

  public changeMapVisibility(id, visible, i) {
    this.loading = true;
    this.as.setMapVisibility(id, visible.checked).subscribe((resp) => {
      this.alerts.showSnackbar(
        visible.checked ? 'Organization is shown in map' : 'Organization is hidden from map',
        'ok',
      );
      this.loading = false;
    }, this.alerts.observableErrorSnackbar);
  }

  public update() {
    if(this.formGroup.invalid || !this.formGroup.dirty){
      console.log(this.formGroup)
      return;
    }
    console.log(this.formGroup)
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);
    delete changedProps.activity_main;
   
    if(changedProps.neighbourhood){
      delete changedProps.neighbourhood;
    }
    if(this.account.street_type !== "" && changedProps.street_type === null){
      changedProps.street_type = "";
    }
    delete changedProps.name;
    delete changedProps.prefix;
    delete changedProps.phone;
    delete changedProps.email;
    delete changedProps.cif;
    delete changedProps.kyc_manager;
    delete changedProps.schedule;
    delete changedProps.level;
    console.log(changedProps)
    this.accountChanged.emit(changedProps);
  }
}
