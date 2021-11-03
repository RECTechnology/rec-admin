import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Document } from 'src/shared/entities/document.ent';
import { DocumentCrud } from 'src/services/crud/documents/documents';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { UtilsService } from 'src/services/utils/utils.service';
import { LemonwayDocumentCrud } from 'src/services/crud/lemonway_documents/lemonway_documents';
import * as moment from 'moment';
import { User } from 'src/shared/entities/user.ent';

@Component({
  selector: 'add-document',
  templateUrl: './add-document.html',
})
export class AddDocumentDia extends BaseDialog {
  public isEdit = false;
  public isLemon = false;
  public status_text = '';
  public isUserSelectorEnabled: Boolean = false;
  public isAccountSelectorEnabled: Boolean = false;
  public user: User = new User();
  public item: Document = {
    name: '',
    kind_id: null,
    account_id: null,
    content: '',
    valid_until: null,
  };
  //(idChange)="search();"
  public itemCopy: Document = {
    name: '',
    kind_id: null,
    account_id: null,
    content: '',
  };

  public itemType = 'Document';
  public docKinds = [];
  public docKindsFull = [];
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

  public ngOnInit() {
    this.item.account_id = this.item.account ? this.item.account.id : this.item.account_id;
    this.item.kind_id = this.item.kind && this.item.kind.id;
    this.itemCopy = Object.assign({}, this.item);
    //this.user= Object.assign({}, item.user);
    this.isLemon = this.item.kind && Object.prototype.hasOwnProperty.call(this.item.kind, 'lemon_doctype');
  }

  public setUser($event) {
    if ($event) {
      this.item.account = null;
      this.item.account_id = null;
    }
  }

  public setAccount($event) {
    if ($event) {
      this.item.user = null;
      this.item.user_id = null;
    }
  }

  public setType(type) {
    if (type != null) {
      this.item.status = type;
    }
  }

  public changeStatusText(text) {
    this.item.status_text = text;
  }

  public getDocumentKinds() {
    this.dkCrud.list({ limit: 100 }).subscribe((resp) => {
      this.docKindsFull = resp.data.elements;
      this.docKinds = this.docKindsFull.map((el) => {
        return {
          value: el.id,
          name: el.name,
        };
      });
    });
  }

  public checkDocumentKind() {
   this.docKindsFull.find((el) => {
      if(el.id === this.item.kind_id){
        if(el.lemon_doctype != null && el.lemon_doctype != undefined){
          this.isLemon = true;
        }else{
          this.isLemon = false;
        }
      }
    });
  }

  public getCrud(data) {
    let kind = this.docKindsFull.find((el) => el.id === data.kind_id);
    const isLemon = kind != undefined && kind.lemon_doctype !== null && kind.lemon_doctype !== undefined;
    return isLemon ? this.lemonDocCrud : this.docCrud;
  }

  public proceed() {
    if (this.loading || !this.item.name) {
      return;
    }

    this.loading = true;
    let data: any = { ...this.item };
    if (data.valid_until) {

     data.valid_until = moment(data.valid_until).local().toISOString(true);

    }
    if (this.isEdit) {
  
      data = UtilsService.deepDiff({ ...data }, this.itemCopy);
     
    }

    if (!Object.keys(data).length) {
      return this.alerts.showSnackbar('Nothing to update...');
    }

    const crud = this.getCrud(data);
    delete data.kind;

    
    if (data.auto_fetched) {
      data.auto_fetched = false;
    }
    if (!data.user_id) {
      delete data.user_id;
    }
    if (!data.account_id) {
      delete data.account_id;
    }
    const call = !this.isEdit ? crud.create(data) : crud.update(this.item.id, UtilsService.sanitizeEntityForEdit(data));

    call.subscribe(
      (resp) => {
        this.alerts.showSnackbar((this.isEdit ? 'Edited' : 'Created') + ' Document correctly!', 'ok');
        this.loading = false;
        this.close();
      },
      (err) => {
        console.log(err);
        if (err.errors) {
          this.validationErrors = err.errors;
        } else {
          this.alerts.showSnackbar(err.message);
        }
        this.loading = false;
      },
    );
  }
}
