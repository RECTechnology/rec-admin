import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';

@Component({
  selector: 'add-document-kind',
  templateUrl: './add-document-kind.html',
})

export class AddDocumentKindDia extends BaseDialog {
  public isEdit = false;
  public item: DocumentKind = {
    name: '',
    description: '',
  };
  public itemType = 'Document Kind';

  constructor(
    public dialogRef: MatDialogRef<AddDocumentKindDia>,
    private us: UserService,
    public alerts: AlertsService,
    public dkCrud: DocumentKindsCrud,
  ) {
    super();
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const call = (!this.isEdit)
      ? this.dkCrud.create(this.item)
      : this.dkCrud.update(this.item.id, UtilsService.sanitizeEntityForEdit(this.item));

    call.subscribe((resp) => {
      this.alerts.showSnackbar((this.isEdit ? 'Edited' : 'Created') + ' Document Kind correctly!', 'ok');
      this.loading = false;
      this.close();
    }, (err) => {
      this.alerts.showSnackbar(err.message, 'ok');
      this.loading = false;
    });
  }
}
