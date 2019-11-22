import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Document } from 'src/shared/entities/document.ent';
import { DocumentCrud } from 'src/services/crud/documents/documents';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { UtilsService } from 'src/services/utils/utils.service';

@Component({
  selector: 'add-document',
  templateUrl: './add-document.html',
})
export class AddDocumentDia extends BaseDialog {
  public isEdit = false;
  public item: Document = {
    name: '',
    kind_id: null,
    account_id: null,
  };
  public itemType = 'Document';
  public docKinds = [];

  constructor(
    public dialogRef: MatDialogRef<AddDocumentDia>,
    private us: UserService,
    public alerts: AlertsService,
    public docCrud: DocumentCrud,
    public dkCrud: DocumentKindsCrud,
  ) {
    super();
    this.getDocumentKinds();
  }

  public getDocumentKinds() {
    this.dkCrud.list({ limit: 100 })
      .subscribe((resp) => {
        this.docKinds = resp.data.elements.map((el) => {
          return {
            value: el.id,
            name: el.name,
          };
        });

        console.log('Doc kinds');
      });
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const call = (!this.isEdit)
      ? this.docCrud.create(this.item)
      : this.docCrud.update(this.item.id, UtilsService.sanitizeEntityForEdit(this.item));

    call.subscribe((resp) => {
      this.alerts.showSnackbar((this.isEdit ? 'Edited' : 'Created') + ' Document correctly!', 'ok');
      this.loading = false;
      this.close();
    }, (err) => {
      this.alerts.showSnackbar(err.message, 'ok');
      this.loading = false;
    });
  }
}