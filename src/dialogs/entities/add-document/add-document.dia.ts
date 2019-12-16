import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Document } from 'src/shared/entities/document.ent';
import { DocumentCrud } from 'src/services/crud/documents/documents';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { UtilsService } from 'src/services/utils/utils.service';
import { FileUpload } from 'src/dialogs/other/file-upload/file-upload.dia';
import { LemonwayDocumentCrud } from 'src/services/crud/lemonway_documents/lemonway_documents';

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
    content: '',
  };
  public itemCopy: Document = {
    name: '',
    kind_id: null,
    account_id: null,
    content: '',
  };
  public itemType = 'Document';
  public docKinds = [];
  public disableAccountSelector = false;
  public validationErrors = [];

  constructor(
    public dialogRef: MatDialogRef<AddDocumentDia>,
    private us: UserService,
    public alerts: AlertsService,
    public docCrud: DocumentCrud,
    public lemonDocCrud: LemonwayDocumentCrud,
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
            value: el,
            name: el.name,
          };
        });
      });
  }

  public getCrud(kind) {
    return (kind.lemon_doctype === undefined) ? this.docCrud : this.lemonDocCrud;
  }

  public ngOnInit() {
    this.item.account_id = this.item.account ? this.item.account.id : this.item.account_id;
    this.item.kind_id = this.item.kind && this.item.kind.id;

    this.itemCopy = Object.assign({}, this.item);
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    let data: any = { ...this.item };
    if (this.isEdit) {
      data = UtilsService.deepDiff(data, this.itemCopy);
    }

    if (!Object.keys(data).length) {
      return this.alerts.showSnackbar('Nothing to update...');
    }

    if (data.kind) {
      data.kind_id = data.kind.id;
    }

    console.log('kinfd', data.kind);
    const crud = this.getCrud(data.kind);
    delete data.kind;

    const call = (!this.isEdit)
      ? crud.create(data)
      : crud.update(this.item.id, UtilsService.sanitizeEntityForEdit(data));

    call.subscribe((resp) => {
      this.alerts.showSnackbar((this.isEdit ? 'Edited' : 'Created') + ' Document correctly!', 'ok');
      this.loading = false;
      this.close();
    }, (err) => {
      if (err.errors) {
        this.validationErrors = err.errors; //UtilsService.normalizeLwError(err.errors);
      } else {
        this.alerts.showSnackbar(err.message);
      }
      this.loading = false;
    });
  }
}
