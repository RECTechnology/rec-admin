import { UserPickerDiaComponent } from './user-picker-dia/user-picker-dia.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { User } from 'src/shared/entities/user.ent';

@Component({
  selector: 'user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss']
})
export class UserPickerComponent   {

  @Input() public user = null;
  @Input() public id = null;
  @Input() public showKeyboard = false;
  @Output() public idChange: EventEmitter<any> = new EventEmitter();
  @Output() public userChange: EventEmitter<any> = new EventEmitter();
  @Input() public disabled = false;
  @Input() public filters = {};

  public areSelectedUser = false;
  public isKeyboard = false;
  public selectedUser: any = {};
  public Brand = environment.Brand;

  constructor(
    public userCrud: UsersCrud,
    public alerts: AlertsService,
  ) { }
 

  public ngOnChanges() {
    this.search();
  }
  
 

  public openSelectUser() {
    this.alerts.openModal(UserPickerDiaComponent, {
      currentid: this.selectedUser && this.selectedUser.id,
      filters: this.filters,
    }).subscribe(this.selectUser.bind(this));
  }

  public selectUser(user: Partial<User>) {
    if (!user || !user.id) {
      this.userChange.emit(null);
      this.idChange.emit(null);
      this.id = null;
      return;
    }

    this.selectedUser = user;
    this.userChange.emit(this.selectedUser);
    this.idChange.emit(this.selectedUser.id);
    this.id = user.id;
  }

  public getUser(id) {
    return this.userCrud.find(id)
      .toPromise()
      .then((resp) => resp.data);
  }

  public search() {
    if (this.user && this.user.id) {
      this.getUser(this.user.id)
        .then((user) => this.selectUser(user))
        .catch((err) => this.selectedUser = {});
    } else if (this.id) {
      this.getUser(this.id)
        .then((account) => this.selectUser(account))
        .catch((err) => this.selectedUser = {});
    } else {
      this.selectedUser = {};
    }
  }

  public onWrite($event) {
    this.idChange.emit(Number($event));
  }

  public changeMode() {
    this.isKeyboard = !this.isKeyboard;
    if (this.isKeyboard) {
      this.selectedUser = { id: this.selectedUser.id };
      this.selectUser(this.selectedUser);
    } else {
      this.getUser(this.selectedUser.id)
        .then(this.selectUser.bind(this));
    }
  }

}
