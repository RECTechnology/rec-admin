import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers';
import { UtilsService } from 'src/services/utils/utils.service';

@Component({
  selector: 'add-tier',
  templateUrl: './add-tier.html',
})
export class AddTierDia extends BaseDialog {
  public isEdit = false;
  public item: Tier = {
    code: '',
    description: '',
  };
  public itemType = 'Tier';
  public docKinds = [];

  constructor(
    public dialogRef: MatDialogRef<AddTierDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
  ) {
    super();
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const call = (!this.isEdit)
      ? this.tiersCrud.create(this.item)
      : this.tiersCrud.update(this.item.id, UtilsService.sanitizeEntityForEdit(this.item));

    call.subscribe((resp) => {
      this.alerts.showSnackbar((this.isEdit ? 'Edited' : 'Created') + ' Tier correctly!', 'ok');
      this.loading = false;
      this.close();
    }, (err) => {
      this.alerts.showSnackbar(err.message, 'ok');
      this.loading = false;
    });
  }
}
