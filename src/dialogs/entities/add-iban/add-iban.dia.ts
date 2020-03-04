import { IbansCrud } from './../../../services/crud/ibans/ibans.crud';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  public itemType = 'Iban';
  public validationErrors = [];

  constructor(
    public dialogRef: MatDialogRef<AddIbanDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
    public accCrud: AccountsCrud,
    public ibansCrud: IbansCrud,
  ) {
    super();
  }

  public proceed() {
    this.ibansCrud.create({ ...this.item, account_id: +this.id })
      .subscribe((resp) => {
        console.log(resp);
      }, (err) => {
        if (err.errors) {
          this.validationErrors = err.errors;
        } else {
          this.alerts.showSnackbar(err.message);
        }
        this.loading = false;
      });
  }
}
