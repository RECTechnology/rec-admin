import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { LemonDocumentKindsCrud } from 'src/services/crud/lemon_document_kinds/lemon_document_kinds';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'add-document-kind',
  templateUrl: './add-document-kind.html',
})
export class AddDocumentKindDia extends BaseDialog {
  public isEdit = false;
  public item: DocumentKind = {
    name: '',
    description: '',
    lemon_doctype: null,
    is_user_document:'false',
    tiers: [],
  };
  public itemType = 'Document Kind';
  public isLemon = false;
  public validationErrors = [];

  public formGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required)
  })
  public inputLength = new FormControl(null, [Validators.min(0), Validators.max(19)]);

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
    this.isLemon = this.inputLength.invalid != false;
  }

  public getCrud() {
    return this.isLemon ? this.lemonDkCrud : this.dkCrud;
  }


  public proceed() {
    if (this.loading || this.disabled || this.formGroup.invalid ||this.inputLength.invalid && this.isLemon
      || !this.formGroup.dirty) {
      return;
    }

    const data = { ...this.item };
    if (!this.isLemon) {
      delete data.lemon_doctype;
      data.is_user_document = "true";
    }

    if (data.tiers) {
      delete data.tiers;
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
