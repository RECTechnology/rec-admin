import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';

@Component({
  selector: 'add-iban',
  templateUrl: './add-iban.html',
})
export class AddIbanDia extends BaseDialog {
  constructor(
    public dialogRef: MatDialogRef<AddIbanDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
    public docKindCrud: DocumentKindsCrud,
  ) {
    super();
  }
}
