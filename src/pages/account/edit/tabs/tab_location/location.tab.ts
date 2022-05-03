import { AlertsService } from 'src/services/alerts/alerts.service';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';
import { AdminService } from 'src/services/admin/admin.service';
import { Neighborhood } from '../../../../../shared/entities/translatable/neighborhood.ent';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'tab-location',
  templateUrl: './location.html',
})
export class LocationTab {
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public initialValue: any = {};
  public edited: boolean = false;
  public error: string;
  public pageName = 'LOCATION';
  public hasChanges: boolean = false;

  public formGroup = new FormGroup({
    address_number: new FormControl(null, Validators.pattern(/^[0-9]*$/)),
    zip: new FormControl("", Validators.pattern(/^[0-9]*$/)),
    street_type: new FormControl(""),
    street: new FormControl(""),
    neighbourhood: new FormControl(""),
    onMap: new FormControl(""),
    latitude: new FormControl(null),
    longitude: new FormControl(null)
  })
  

  constructor(private utils: UtilsService, public alerts: AlertsService, public as: AdminService) {}

  public ngOnInit() {
    this.accountCopy = { ...this.account };
    this.formGroup.get('street_type').setValue(this.accountCopy.street_type);
    this.formGroup.get('address_number').setValue(this.accountCopy.address_number);
    this.formGroup.get('neighbourhood').setValue(this.accountCopy.neighbourhood);
    this.formGroup.get('street').setValue(this.accountCopy.street);
    this.formGroup.get('onMap').setValue(this.accountCopy.on_map);
    this.formGroup.get('zip').setValue(this.accountCopy.zip);
    this.formGroup.get('latitude').setValue(this.accountCopy.latitude);
    this.formGroup.get('longitude').setValue(this.accountCopy.longitude);
    this.validation();
  }

  public setInitialValue(){
    this.initialValue = {
      street: this.accountCopy.street,
      neighbourhood:  this.accountCopy.neighbourhood,
      address_number: this.accountCopy.address_number,
      street_type: this.accountCopy.street_type,
      onMap: this.accountCopy.on_map,
      zip: this.accountCopy.zip,
      latitude: this.accountCopy.latitude,
      longitude: this.accountCopy.longitude,
    }
  }

  public validation(){
   
    this.setInitialValue();

    this.formGroup.valueChanges
      .pipe(
        debounceTime(100)
      )
      .subscribe(resp => {
        this.edited = Object.keys(this.initialValue).some(key => this.formGroup.value[key] != 
          this.initialValue[key])
      })
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
    if(this.formGroup.invalid || !this.formGroup.dirty || !this.edited){
      return;
    }
    this.accountCopy.street = this.formGroup.get("street").value;
    this.accountCopy.zip = this.formGroup.get("zip").value;
    this.accountCopy.street_type = this.formGroup.get("street_type").value;
    this.accountCopy.neighbourhood = this.formGroup.get("neighbourhood").value;
    this.accountCopy.on_map = this.formGroup.get("onMap").value;
    this.accountCopy.address_number = this.formGroup.get("address_number").value;
    this.accountCopy.latitude = this.formGroup.get("latitude").value;
    this.accountCopy.longitude = this.formGroup.get("longitude").value;

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
    this.accountChanged.emit(changedProps);

    this.setInitialValue();
    this.edited = false;
  }

}
