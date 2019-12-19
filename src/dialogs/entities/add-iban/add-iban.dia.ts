import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Iban } from 'src/shared/entities/iban.ent';

@Component({
  selector: 'add-iban',
  templateUrl: './add-iban.html',
})
export class AddIbanDia extends BaseDialog {
  public item: Iban = {
    number: '',
    holder: '',
    bank_name: '',
    bank_address: '',
    bic: '',
    name: '',
  };

  public id = null;

  constructor(
    public dialogRef: MatDialogRef<AddIbanDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
    public accCrud: AccountsCrud,
  ) {
    super();
  }

  public proceed() {
    this.accCrud.createIBAN(this.id, this.item)
      .subscribe((resp) => {
        console.log(resp);
      }, (err) => {
        console.log(err);
      });
  }
}
