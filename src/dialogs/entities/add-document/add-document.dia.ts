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
import { AccountsCrud } from '../../../services/crud/accounts/accounts.crud';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Account } from '../../../shared/entities/account.ent';
import { EmptyValidators } from '../../../components/validators/EmptyValidators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'add-document',
  templateUrl: './add-document.html',
})
export class AddDocumentDia extends BaseDialog {
  public isEdit = false;
  public edited = false;
  public isLemon = false;
  public status_text = '';
  public isUserSelectorEnabled: Boolean = false;
  public isAccountSelectorEnabled: Boolean = false;
  public lwKind: Boolean = false;
  public user: User = new User();
  public item: Document = {
    name: '',
    kind_id: null,
    account_id: null,
    content: '',
    valid_until: null
  };
  //(idChange)="search();"
  public itemCopy: Document = {
    name: '',
    kind_id: null,
    account_id: null,
    content: '',
    user_id: null
  };
  public formGroup = new FormGroup({
    kind: new FormControl(null, Validators.required),
    account: new FormControl({}),
    user: new FormControl({}),
    name: new FormControl("", [Validators.required, Validators.minLength(1)]),
    status: new FormControl(""),
    status_text: new FormControl(""),
    valid_until: new FormControl(null),
    content: new FormControl(null)
  })
  public itemType = 'Document';
  public docKinds = [];
  public docKindsFull = [];
  public disableAccountSelector = false;
  public validationErrors = [];
  public datepipe: DatePipe = new DatePipe('es');

  constructor(
    public dialogRef: MatDialogRef<AddDocumentDia>,
    private us: UserService,
    public alerts: AlertsService,
    public docCrud: DocumentCrud,
    public lemonDocCrud: LemonwayDocumentCrud,
    public dkCrud: DocumentKindsCrud,
    public accountCrud: AccountsCrud
  ) {
    super();
  }

  public ngOnInit() {
      this.item.account_id = this.item.account ? this.item.account.id : this.item.account_id;
      this.item.kind_id = this.item.kind ? this.item.kind.id : this.item.kind_id;
      this.item.user_id = this.item.user ? this.item.user.id : this.item.user_id;
    if(this.item.account_id){
      this.accountCrud.find(this.item.account_id)
      .subscribe( account => {
        this.item.account = account.data;
      })
    }
    if(this.item.user){
      this.accountCrud.find(this.item.user.id)
      .subscribe( user => {
        this.item.user = user.data;
      })
    }
    this.formGroup.get("kind").setValue(this.item.kind);
    this.formGroup.get("account").setValue(this.item.account);
    this.formGroup.get("user").setValue(this.item.user);
    this.formGroup.get("name").setValue(this.item.name ?? "");
    this.formGroup.get("status").setValue(this.item.status);
    this.formGroup.get("status_text").setValue(this.item.status_text ?? "");
    this.formGroup.get("valid_until").setValue(this.item.valid_until);
    this.formGroup.get("content").setValue(this.item.content);

    this.itemCopy = Object.assign({}, this.item);
    //this.user= Object.assign({}, item.user);
    this.isLemon = this.item.kind && Object.prototype.hasOwnProperty.call(this.item.kind, 'lemon_doctype');
    this.validation();
  }

  public validation(){
    const date = new Date(this.item.valid_until);
    const initialValue = {
      name: this.item.name ?? "",
      status: this.item.status,
      status_text: this.item.status_text ?? "",
      valid_until: this.datepipe.transform(date, "yyyy-MM-ddT00:00:00+00:00"),
      content: this.item.content
    }
    const kind =  this.item.kind_id;
    const account = this.item.account_id;
    const user = this.item.user_id;
    this.formGroup.valueChanges
      .pipe(
        debounceTime(100)
      )
      .subscribe(resp => {
        this.itemCopy.kind_id = resp.kind ? resp.kind.id : undefined;
        this.itemCopy.user_id = resp.user ? resp.user.id : undefined;
        this.itemCopy.account_id = resp.account ? resp.account.id : undefined;
        resp.valid_until = this.datepipe.transform(resp.valid_until, "yyyy-MM-ddT00:00:00+00:00")
    
        if(Object.keys(initialValue).some(key => resp[key] !=
          initialValue[key]) || (kind != this.itemCopy.kind_id) ||
          (account !=  this.itemCopy.account_id)
          || (user != this.itemCopy.user_id)){
            this.edited = true
          }else {
            this.edited = false
          }
          console.log(resp)
          console.log(initialValue)
      })
      
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

  public kindChanged($event) {
    this.item.kind = $event;
    if(this.item.kind){
      this.item.kind.lemon_doctype ? this.lwKind = true : this.lwKind = false;
    }else {
      this.lwKind = false
    }
  }

  public getCrud(data) {
    let kind = data.kind;
    const isLemon = kind != undefined && kind.lemon_doctype !== null && kind.lemon_doctype !== undefined;

    return isLemon ? this.lemonDocCrud : this.docCrud;
  }

  public proceed() {
    if (this.loading || this.formGroup.invalid || this.formGroup.dirty && !this.edited) {
      return;
    }

    this.item.kind = this.formGroup.get("kind").value;
    this.item.account = this.formGroup.get("account").value;
    this.item.user = this.formGroup.get("user").value;
    this.item.name = this.formGroup.get("name").value;
    this.item.status = this.formGroup.get("status").value;
    this.item.status_text = this.formGroup.get("status_text").value;
    this.item.valid_until = this.formGroup.get("valid_until").value;
    this.item.content = this.formGroup.get("content").value;

    this.loading = true;
    let data: any = { ...this.item };

    if (data.valid_until) {
      data.valid_until = moment(data.valid_until).local().toISOString(true);
    }
    if (this.isEdit) {
      data = UtilsService.deepDiff({ ...data }, this.itemCopy);
    }

    const crud = this.getCrud(data);

    if (data.kind) {
      data.kind_id = data.kind.id;
      delete data.kind;
    }
    if (data.auto_fetched) {
      data.auto_fetched = false;
    }
    if (!data.user_id) {
      delete data.user_id;
    }
    if(data.account){
      data.account_id = data.account.id;
      delete data.account;
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
