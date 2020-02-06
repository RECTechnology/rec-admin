import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { LemonDocumentKindsCrud } from 'src/services/crud/lemon_document_kinds/lemon_document_kinds';

@Component({
  selector: 'add-document-kind',
  templateUrl: './add-document-kind.html',
})
export class AddDocumentKindDia extends BaseDialog {
  public isEdit = false;
  public item: DocumentKind = {
    name: '',
    description: '',
    lemon_doctype: '0',
  };
  public itemType = 'Document Kind';
  public isLemon = false;
  public validationErrors = [];

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
    this.isLemon = this.item.lemon_doctype !== undefined;
  }

  public getCrud() {
    return this.isLemon ? this.lemonDkCrud : this.dkCrud;
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    const data = { ...this.item };
    if (!this.isLemon) {
      delete data.lemon_doctype;
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
    }, (err) => {
      if (err.errors) {
        this.validationErrors = UtilsService.normalizeLwError(err.errors);
      } else {
        this.alerts.showSnackbar(err.message);
      }
      this.loading = false;
    });
  }
}
