import { Component, AfterContentInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AddUserDia } from '../../dialogs/management/add-user/add-user.dia';
import { MatDialog } from '@angular/material';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { CompanyService } from '../../services/company/company.service';
import { ViewDetails } from '../../dialogs/management/view-details/view-details.dia';
import { EditUserData } from '../../dialogs/management/edit-user/edit-user.dia';
import { ControlesService } from '../../services/controles/controles.service';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../dialogs/other/export-dialog/export.dia';
import {
  TlHeader, TlItemOption, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { User } from 'src/shared/entities/user.ent';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';
import { UsersExportDefaults } from 'src/data/export-defaults';

@Component({
  selector: 'users',
  styleUrls: ['./users.css'],
  templateUrl: './users.html',
})
export class UsersPage extends TablePageBase implements AfterContentInit {
  public pageName = 'Users';
  public sortedData: User[] = this.usersCrud.cached;
  public loading = true;
  public activeUsers = false;
  public inactiveUsers = false;
  public profesionalUsers = false;
  public particularUsers = false;

  public headers: TlHeader[] = [
    TlHeaders.Id,
    TlHeaders.Avatar,
    TlHeaders.generate('username'),
    TlHeaders.Email,
    TlHeaders.Phone,
    TlHeaders.CompaniesTotal,
  ];
  public itemOptions: TlItemOption[] = [
    TlItemOptions.Edit(this.openEditUser.bind(this)),
    TlItemOptions.Delete(this.openDeleteUser.bind(this)),
  ];
  public defaultExportKvp = UsersExportDefaults;
  public tableOptions: TableListOptions = {
    optionsType: 'buttons',
    onClick: (entry) => this.openViewDetails(entry),
  };

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
  public openAddUserDia() {
    this.alerts.openModal(AddUserDia, {
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
      { btnConfirmText: 'Delete' },
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

  public search(query: string = this.query) {
    this.loading = true;
    this.query = query;
    const data: ListAccountsParams = this.getCleanParams(query);

    this.usersCrud.list(data)
      .pipe(this.usersCrud.cache())
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
