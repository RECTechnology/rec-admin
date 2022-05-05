import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { LemonDocumentKindsCrud } from 'src/services/crud/lemon_document_kinds/lemon_document_kinds';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { EmptyValidators } from '../../../components/validators/EmptyValidators';

@Component({
  selector: 'add-document-kind',
  templateUrl: './add-document-kind.html',
})
export class AddDocumentKindDia extends BaseDialog {
  public isEdit = false;
  public edited = false;
  public itemCopy: any;
  public itemType = 'Document Kind';
  public validationErrors = [];
  public formGroup = new FormGroup({
    name: new FormControl("",[Validators.required, EmptyValidators.noWhitespaceValidator]),
    description: new FormControl("", [Validators.required, EmptyValidators.noWhitespaceValidator]),
    lemon_doctype: new FormControl(null, [Validators.min(0), Validators.max(19)]),
    is_user_document: new FormControl(),
    tiers: new FormControl([]),
    isLemon: new FormControl(false)
  })
  public item: DocumentKind = {
    name:  "",
    description: "",
    lemon_doctype:  0,
    is_user_document:'',
    tiers: [],
  };

  constructor(
    public dialogRef: MatDialogRef<AddDocumentKindDia>,
    private us: UserService,
    public alerts: AlertsService,
    public dkCrud: DocumentKindsCrud,
    public lemonDkCrud: LemonDocumentKindsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.formGroup.get('name').setValue(this.item.name);
    this.formGroup.get('description').setValue(this.item.description);
    this.formGroup.get('lemon_doctype').setValue(this.item.lemon_doctype);
    this.formGroup.get('is_user_document').setValue(this.item.is_user_document);
    if(this.isEdit){
      this.formGroup.get('lemon_doctype').setErrors(null);
    }
    this.validation();
  }

  public validation(){
      this.itemCopy = {
        name: this.item.name,
        description: this.item.description
      }
      const initialValue = this.itemCopy;
      this.formGroup.valueChanges
        .pipe(
          debounceTime(100)
        )
        .subscribe(resp => {
          this.edited = Object.keys(initialValue).some(key => this.formGroup.value[key] != 
            initialValue[key])
            if(!resp.isLemon){
              this.formGroup.get('lemon_doctype').setErrors(null);
            }
        })
    }
  
  public getCrud() {
    return this.formGroup.get('isLemon').value == true ? this.lemonDkCrud : this.dkCrud;
  }


  public proceed() {
    if (this.loading || this.disabled || this.formGroup.invalid
      || !this.formGroup.dirty || this.edited == false) {
      return;
    }

    this.item.name = this.formGroup.get('name').value;
    this.item.description = this.formGroup.get('description').value;
    this.item.lemon_doctype = this.formGroup.get('lemon_doctype').value;

    const data = { ...this.item };
    if (this.formGroup.get('isLemon').value != true) {
      delete data.lemon_doctype;
      data.is_user_document = "true";
    }else {
      data.is_user_document = "false";
    }

    if (data.tiers) {
      delete data.tiers;
    }

    if(this.isEdit){
      delete  data.lemon_doctype;
      delete  data.is_user_document;
    }

    this.loading = true;

    const crud = this.getCrud();
  
      const call = (!this.isEdit)
      ? crud.create(data)
      : crud.update(data.id, UtilsService.sanitizeEntityForEdit(data));

      call.subscribe((resp) => {
        this.alerts.showSnackbar((this.isEdit ? 'Edited' : 'Created') + ' Document Kind correctly!', 'ok');
        this.loading = false;
        this.close();
      }, UtilsService.handleValidationError.bind(this, this));
    } 
  }
function input() {
  throw new Error('Function not implemented.');
}

