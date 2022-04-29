import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { UtilsService } from 'src/services/utils/utils.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'add-tier',
  templateUrl: './add-tier.html',
})
export class AddTierDia extends BaseDialog {
  public isEdit = false;
  public edited = false;
  public item: Tier = {
    code: '',
    description: '',
    document_kinds: [],
  };
  public itemCopy: Tier = {
    code: '',
    description: '',
    parent_id: "",
    document_kinds: [],
  };
  public formGroup = new FormGroup({
    code: new FormControl("", Validators.required),
    description: new FormControl(),
    parent_id: new FormControl()
  })
  public itemType = 'Tier';
  public docKinds: DocumentKind[] = [];
  public tiers: Tier[] = [];
  public query: string;

  constructor(
    public dialogRef: MatDialogRef<AddTierDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
    public docKindCrud: DocumentKindsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.itemCopy = Object.assign({}, this.item);
    this.formGroup.get('code').setValue(this.item.code),
    this.formGroup.get('description').setValue(this.item.description),
    this.formGroup.get('parent_id').setValue(this.item.parent_id)


    if (this.isEdit) {
      this.getTier();
      this.search();
    }
    this.getTiers();
    this.validation();
  }

  public validation(){
    this.formGroup.valueChanges
      .pipe(
        debounceTime(100)
      )
      .subscribe(resp => {
       
        if(this.itemCopy.code != resp.code || this.itemCopy.description != resp.description 
          || this.itemCopy.parent_id != resp.parent_id){
            this.edited = true
          }else {
            this.edited = false
          }
      })
  }

  public getTier() {
    this.tiersCrud.find(this.item.id)
      .subscribe((resp) => {
        this.item = resp.data;
      });
  }

  public getTiers() {
    this.tiersCrud.list()
      .subscribe((res) => {
        this.tiers = res.data.elements.map((el) => {
          return {
            value: el.id,
            name: el.code,
          };
        });
      });
  }

  public search() {
    this.docKindCrud.list({ offset: 0, limit: 100, sort: 'name', order: 'asc', query: this.query })
      .subscribe((resp) => {
        this.docKinds = resp.data.elements;
      });
  }

  public deleteDoc(doc: DocumentKind) {
    this.tiersCrud.unsetDocumentKind(doc.id, this.item.id)
      .subscribe((resp) => {
        this.getTier();
        this.search();
        this.alerts.showSnackbar('REMOVED_DOCUMENT');
      }, (err) => {
        this.alerts.showSnackbar(err.message);
      });
  }

  public addDocKind(doc: DocumentKind) {
    this.tiersCrud.setDocumentKind(this.item.id, doc.id)
      .subscribe((resp) => {
        this.getTier();
        this.search();
        this.alerts.showSnackbar('CREATED_DOCUMENT');
      }, (err) => {
        this.alerts.showSnackbar(err.message);
      });
  }

  public proceed() {
    if (this.loading || this.formGroup.invalid || !this.edited && this.isEdit) {
      return;
    }

    this.item.code = this.formGroup.get('code').value;
    this.item.description = this.formGroup.get('description').value;
    this.item.parent_id = this.formGroup.get('parent_id').value;

    this.loading = true;
    let data: any = { ...this.item };

    if (this.isEdit) {
      data = UtilsService.deepDiff({ ...data }, this.itemCopy);
    }

    data = UtilsService.sanitizeEntityForEdit(data);

    if (!Object.keys(data).length) {
      this.loading = false;
      return this.alerts.showSnackbar('NO_UPDATE');
    }

    const call = (!this.isEdit)
      ? this.tiersCrud.create(data)
      : this.tiersCrud.update(this.item.id, data);

    call.subscribe((resp) => {
      this.item.id = resp.data.id;
      this.alerts.showSnackbar((this.isEdit ? 'EDITED' : 'CREATED') + ' Tier correctly!', 'ok');
      this.loading = false;
      if (this.isEdit) {
        this.close();
      } else {
        this.isEdit = true;
        this.search();
      }
    }, (err) => {
      this.alerts.showSnackbar(err.message, 'ok');
      this.loading = false;
    });
  }
}
