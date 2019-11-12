import { Component, AfterContentInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AddUser } from '../../dialogs/add-user/add-user.dia';
import { MatDialog } from '@angular/material';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { CompanyService } from '../../services/company/company.service';
import { ViewDetails } from '../../dialogs/view-details/view-details.dia';
import { EditUserData } from '../../dialogs/edit-user/edit-user.dia';
import { ControlesService } from '../../services/controles/controles.service';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';
import { TlHeader, TlItemOption } from 'src/components/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { User } from 'src/shared/entities/user.ent';

@Component({
  selector: 'users',
  styleUrls: ['./users.css'],
  templateUrl: './users.html',
})
export class UsersPage extends TablePageBase implements AfterContentInit {
  public pageName = 'Users';
  public sortedData: User[] = [];
  public loading = true;
  public activeUsers = false;
  public inactiveUsers = false;
  public profesionalUsers = false;
  public particularUsers = false;

  public headerOpts = { input: true };
  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
      type: 'code',
    }, {
      avatar: {
        sort: 'profile_image',
        title: 'Profile Image',
      },
      sort: 'name',
      title: 'Name',
      type: 'avatar',
    }, {
      sort: 'username',
      title: 'Username',
    }, {
      sort: 'email',
      title: 'Email',
    }, {
      accessor: (el) => {
        const hasPlus = String(el.prefix).includes('+');
        return (!hasPlus ? '+' : '') + (el.prefix || '--') + ' ' + (el.phone || 'not-set');
      },
      sort: 'phone',
      title: 'Phone',
    }, {
      accessor: (el) => el.accounts ? el.accounts.length : 0,
      sort: 'companies',
      title: 'Companies',
    }];
  public itemOptions: TlItemOption[] = [
    {
      callback: this.openViewDetails.bind(this),
      text: 'View',
      icon: 'fa-eye',
    }, {
      callback: this.openEditUser.bind(this),
      text: 'Edit',
      icon: 'fa-edit',
    }, {
      callback: this.openDeleteUser.bind(this),
      class: 'col-red col-error',
      text: 'Delete',
      icon: 'fa-trash',
    }];
  public defaultExportKvp = [
    { key: 'id', value: '$.id', active: true },
    { key: 'username', value: '$.username', active: true },
    { key: 'email', value: '$.email', active: true },
    { key: 'enabled', value: '$.enabled', active: true },
    { key: 'locked', value: '$.locked', active: true },
    { key: 'expired', value: '$.expired', active: true },
    { key: 'roles', value: '$.roles[*]', active: true },
    { key: 'name', value: '$.name', active: true },
    { key: 'created', value: '$.created', active: true },
    { key: 'dni', value: '$.dni', active: true },
    { key: 'prefix', value: '$.prefix', active: true },
    { key: 'phone', value: '$.phone', active: true },
    { key: 'pin', value: '$.pin', active: true },
    { key: 'public_phone', value: '$.public_phone', active: true },
  ];

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public us: UserService,
    public companyService: CompanyService,
    public utils: UtilsService,
    public as: AdminService,
    public controles: ControlesService,
    public ls: LoginService,
    public usersCrud: UsersCrud,
    public alerts: AlertsService,
  ) {
    super();
  }

  public getCleanParams(query?: string) {
    const data: ListAccountsParams = {
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.query,
      sort: this.sortID,
    };

    return data;
  }

  // Opens add user modal
  public openAddUser() {
    this.alerts.openModal(AddUser, {
      addReseller: false,
      showCreateNewUser: false,
    }).subscribe((result) => {
      this.search();
    });
  }

  // Opens edit user roles modal
  public openEditUser(user, i) {
    this.alerts.openModal(EditUserData, {
      user,
    }).subscribe((result) => {
      this.search();
    });
  }

  // Opens delete user modal
  public openDeleteUser(user) {
    const accName = this.us.userData.group_data.name;
    this.alerts.showConfirmation(
      'Are you sure you want to remove user from the sistem [ ' + accName + ' ]? No going back.',
      'Remove user from system?',
      'Delete',
      'error',
    ).subscribe((result) => {
      if (result) { this.removeUser(user); }
    });
  }

  public openViewDetails(user) {
    this.alerts.openModal(ViewDetails, {
      parent: this,
      user,
    }).subscribe((result) => {
      if (result) {
        this.search();
      }
    });
  }

  public export() {
    const data: ListAccountsParams = this.getCleanParams();

    delete data.offset;
    delete data.limit;

    return this.alerts.openModal(ExportDialog, {
      defaultExports: [...this.defaultExportKvp],
      entityName: 'Users',
      filters: data,
      fn: this.usersCrud.export.bind(this.usersCrud),
      list: [...this.defaultExportKvp],
    });
  }

  public search(query: string = '') {
    this.loading = true;
    const data: ListAccountsParams = this.getCleanParams(query);

    this.usersCrud.list(data)
      .subscribe(
        (resp) => {
          this.companyService.companyUsers = resp.data.elements;
          this.sortedData = this.companyService.companyUsers.slice();
          this.showing = this.companyService.companyUsers.length;
          this.total = resp.data.total;
          this.loading = false;
        },
        (error) => { this.loading = false; });
  }

  private removeUser(user) {
    this.companyService.removeUserFromSystem(user.id)
      .subscribe(
        (resp) => {
          this.search();
          this.alerts.showSnackbar('Deleted user from system', 'ok');
        },
        (error) => {
          this.alerts.showSnackbar('Error deleting user: ' + error.message, 'ok');
        });
  }
}
