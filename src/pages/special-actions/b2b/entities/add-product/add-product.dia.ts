import { Component, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { EmptyValidators } from '../../../../../components/validators/EmptyValidators';
import { DuplicatedProduct } from '../duplicated-product/duplicated-product.dia';

@Component({
  selector: 'add-product',
  styleUrls: ['./add-product.scss'],
  templateUrl: './add-product.dia.html',
})
export class AddProductDia {
  public title: string = 'ADD_ITEM';
  public error: string;
  public loading: boolean = false;
  public disabled: boolean = false;
  public auxiliarItem: any;

  public main_activity_id: any;
  public main_activity: any;
  public secondary_activity: any;

  public actQuery = '';

  public isEdit = false;
  public edited = false;
  public activities = [];
  public activitiesSelected = [];
  public formGroup = new FormGroup({
    name_ca: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    name_es: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    name: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    name_plural: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    name_ca_plural: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    name_es_plural: new FormControl('', [Validators.required, EmptyValidators.noWhitespaceValidator]),
    parent: new FormControl(),
  });

  public item: any = {
    default_consuming_by: [],
    default_producing_by: [],
    name_ca: '',
    name_es: '',
    name: '',
    name_plural: '',
    name_ca_plural: '',
    name_es_plural: '',
    activity: Activity,
  };

  public itemCopy: any;

  public langMap = {
    cat: 'ca',
    en: 'en',
    es: 'es',
  };

  constructor(
    public dialogRef: MatDialogRef<AddProductDia>,
    public us: UserService,
    public translate: TranslateService,
    public activitiesCrud: ActivitiesCrud,
    public productsCrud: ProductsCrud,
    public alerts: AlertsService,
  ) {
    this.activitiesCrud
      .search({ offset: 0, limit: 100, sort: 'name', order: 'asc' }, this.langMap[this.us.lang])
      .subscribe((resp) => this.setActivities(resp));
  }

  public setActivities(resp: any) {
    this.activities = resp.data.elements;
  }

  public itemsFilled() {
    return (
      this.formGroup.get('name').valid &&
      this.formGroup.get('name_ca').valid &&
      this.formGroup.get('name_es').valid &&
      this.formGroup.get('name_plural').valid &&
      this.formGroup.get('name_ca_plural').valid &&
      this.formGroup.get('name_es_plural').valid
    );
  }

  public ngOnInit() {
    this.formGroup.get('name').setValue(this.item.name);
    this.formGroup.get('name_ca').setValue(this.item.name_ca);
    this.formGroup.get('name_es').setValue(this.item.name_es);
    this.formGroup.get('name_plural').setValue(this.item.name_plural);
    this.formGroup.get('name_ca_plural').setValue(this.item.name_ca_plural);
    this.formGroup.get('name_es_plural').setValue(this.item.name_es_plural);
    if (this.item.parent != null) {
      this.secondary_activity = this.item.parent;
    }
    this.activitiesSelected = this.item.activities;
    this.formGroup.get('parent').setValue(this.item.parent);
    this.validation();
  }

  public selectParentActivity(item) {
    this.main_activity = item;
    this.main_activity_id = this.main_activity ? this.main_activity.id : null;

    // Aqui seteamos secondary_activity a null, para que tengan que volver a seleccionar una subactivity
    // Esto se hace porque cuando se selecciona un parent diferente, las subactivities son otras, por lo que tenemos que resetear el campo
    this.secondary_activity = null;
  }

  public selectActivity(item) {
    this.secondary_activity = item;
  }

  public addedSubscriber(sub, message = 'ADDED_ACTIVITY') {
    sub.subscribe(
      (resp) => {
        this.alerts.showSnackbar(message, 'ok');
        this.loading = false;
      },
      (error) => {
        if (error.message == 'Duplicated resource (duplicated entry)') {
          this.alerts.showSnackbar('Duplicated activity (duplicated entry)', 'ok');
          this.item.default_consuming_by.pop();
        } else {
          this.alerts.showSnackbar(error.message, 'ok');
        }
        this.loading = false;
      },
    );
  }

  public trackByFn(i, item) {
    return item.id;
  }

  public deletedSubscriber(sub, message = 'Deleted activity') {
    sub.subscribe(
      (resp) => {
        this.alerts.showSnackbar(message, 'ok');
        this.loading = false;
      },
      (error) => {
        if (error.message === 'Conflict') {
          error.message = 'ERROR_DUP';
        }
        this.alerts.showSnackbar(error.message, 'ok');
        this.loading = false;
      },
    );
  }

  public addActivity(act) {
    // this.loading = true;
    if (!this.activitiesSelected.includes(act)) {
      this.activitiesSelected.push(act);
    }
    console.log(this.item);
    this.productsCrud.addActivityToProduct(this.item.id, act.id).subscribe(() => {
      this.alerts.showSnackbar('ADDED_ACTIVITY', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public deleteActivity(i) {
    const act = this.activitiesSelected[i];
    this.activitiesSelected.splice(i, 1);
    this.productsCrud.removeActivityFromProduct(this.item.id, act.id).subscribe((resp) => {
      this.alerts.showSnackbar('REMOVED_ACTIVITY', 'ok');
      this.loading = false;
    }, this.alerts.observableErrorSnackbar.bind(this.alerts));
  }

  public validation() {
    this.itemCopy = {
      name: this.item.name,
      name_ca: this.item.name_ca,
      name_es: this.item.name_es,
    };
    const parent = this.item.parent;
    const initialValue = this.itemCopy;
    this.formGroup.valueChanges.pipe(debounceTime(100)).subscribe((resp) => {
      if (parent) {
        this.edited =
          Object.keys(initialValue).some((key) => resp[key] != initialValue[key]) || parent.id != resp.parent.id;
      } else {
        this.edited = Object.keys(initialValue).some((key) => resp[key] != initialValue[key]) || parent != resp.parent;
      }
    });
  }

  public add() {
    if (this.formGroup.invalid || this.loading || this.disabled || !this.formGroup.dirty || this.edited == false) {
      return;
    }
    if (this.secondary_activity != null) {
      this.item.parent_id = this.secondary_activity.id;
    }
    this.item.name = this.formGroup.get('name').value;
    this.item.name_ca = this.formGroup.get('name_ca').value;
    this.item.name_es = this.formGroup.get('name_es').value;

    this.item.name_plural = this.formGroup.get('name_plural').value;
    this.item.name_ca_plural = this.formGroup.get('name_ca_plural').value;
    this.item.name_es_plural = this.formGroup.get('name_es_plural').value;

    this.item.name_ca = this.item.name_ca.trim();
    this.item.name_es = this.item.name_es.trim();
    this.item.name = this.item.name.trim();
    
    this.item.name_ca_plural = this.item.name_ca_plural.trim();
    this.item.name_es_plural = this.item.name_es_plural.trim();
    this.item.name_plural = this.item.name_plural.trim();

    this.dialogRef.close({ ...this.item });
  }

  public openDupped() {
    this.alerts.openModal(DuplicatedProduct, {});
  }

  public close(): void {
    this.dialogRef.close(false);
  }

  public nameMatches(name: string) {
    return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
  }
}
