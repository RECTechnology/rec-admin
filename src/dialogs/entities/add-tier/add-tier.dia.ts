import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
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
    document_kinds: [],
  };
  public itemCopy: Tier = {
    code: '',
    description: '',
    document_kinds: [],
  };
  public itemType = 'Tier';
  public docKinds: DocumentKind[] = [];
  public tiers: Tier[] = [];
  public query: string;

  constructor(
    public dialogRef: MatDialogRef<AddTierDia>,
    private us: UserService,
    public alerts: AlertsService,
    public tiersCrud: TiersCrud,
    public docKindCrud: DocumentKindsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.itemCopy = Object.assign({}, this.item);

    if (this.isEdit) {
      this.getTier();
      this.search();
    }
    this.getTiers();
  }

  public getTier() {
    this.tiersCrud.find(this.item.id)
      .subscribe((resp) => {
        this.item = resp.data;
      });
  }

  public getTiers() {
    this.tiersCrud.list()
      .subscribe((res) => {
        this.tiers = res.data.elements.map((el) => {
          return {
            value: el.id,
            name: el.code,
          };
        });
      });
  }

  public search() {
    this.docKindCrud.list({ offset: 0, limit: 100, sort: 'name', order: 'asc', query: this.query })
      .subscribe((resp) => {
        this.docKinds = resp.data.elements;
      });
  }

  public deleteDoc(doc: DocumentKind) {
    this.tiersCrud.unsetDocumentKind(doc.id, this.item.id)
      .subscribe((resp) => {
        this.getTier();
        this.search();
        this.alerts.showSnackbar('REMOVED_DOCUMENT');
      }, (err) => {
        this.alerts.showSnackbar(err.message);
      });
  }

  public addDocKind(doc: DocumentKind) {
    this.tiersCrud.setDocumentKind(this.item.id, doc.id)
      .subscribe((resp) => {
        this.getTier();
        this.search();
        this.alerts.showSnackbar('CREATED_DOCUMENT');
      }, (err) => {
        this.alerts.showSnackbar(err.message);
      });
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    let data: any = { ...this.item };

    if (this.isEdit) {
      data = UtilsService.deepDiff({ ...data }, this.itemCopy);
    }

    data = UtilsService.sanitizeEntityForEdit(data);

    if (!Object.keys(data).length) {
      this.loading = false;
      return this.alerts.showSnackbar('NO_UPDATE');
    }

    const call = (!this.isEdit)
      ? this.tiersCrud.create(data)
      : this.tiersCrud.update(this.item.id, data);

    call.subscribe((resp) => {
      this.item.id = resp.data.id;
      this.alerts.showSnackbar((this.isEdit ? 'EDITED' : 'CREATED') + ' Tier correctly!', 'ok');
      this.loading = false;
      if (this.isEdit) {
        this.close();
      } else {
        this.isEdit = true;
        this.search();
      }
    }, (err) => {
      this.alerts.showSnackbar(err.message, 'ok');
      this.loading = false;
    });
  }
}
