import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers';
import { UtilsService } from 'src/services/utils/utils.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';

@Component({
  selector: 'add-tier',
  templateUrl: './add-tier.html',
})
export class AddTierDia extends BaseDialog {
  public isEdit = false;
  public item: Tier = {
    code: '',
    description: '',
    document_kinds_id: [],
  };
  public itemType = 'Tier';
  public docKinds: DocumentKind[] = [];
  public query: string;

  constructor(
    public dialogRef: MatDialogRef<AddTierDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
    public docKindCrud: DocumentKindsCrud,
  ) {
    super();
    this.search();
  }

  public search() {
    this.docKindCrud.list({ offset: 0, limit: 100, sort: 'name', order: 'asc', query: this.query })
      .subscribe((resp) => {
        this.docKinds = resp.data.total;
      });
  }

  public deleteDoc(doc: DocumentType) {
    // this.tiersCrud.
  }

  public addDocKind(doc: DocumentType) {
    // this.tiersCrud.addDocumentKind(this.ti);
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
      this.isEdit = true;
    }, (err) => {
      this.alerts.showSnackbar(err.message, 'ok');
      this.loading = false;
    });
  }
}
