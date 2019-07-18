import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AddUser } from '../dialogs/add-user/add-user.dia';
import { MatDialog, Sort } from '@angular/material';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { ConfirmationMessage } from '../../components/dialogs/confirmation-message/confirmation.dia';
import { CompanyService } from '../../services/company/company.service';
import { ViewDetails } from '../dialogs/view-details/view-details.dia';
import { EditUserData } from '../dialogs/edit-user/edit-user.dia';
import { environment } from '../../environments/environment';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { ControlesService } from '../../services/controles/controles.service';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';
import { TlHeader, TlItemOption } from 'src/components/table-list/tl-table/tl-table.component';

@Component({
  selector: 'users',
  styleUrls: ['./users.css'],
  templateUrl: './users.html',
})
export class UsersPage implements OnInit {
  public loading = false;
  public canAddUser = false;
  public searchQuery = '';
  public offset = 0;
  public limit = 10;
  public showingUsers = 0;
  public totalUsers = 0;
  public brand = environment.Brand;
  public sortedData: any[] = [];

  public sortID: string = 'id';
  public sortDir: string = 'desc';

  public headerOpts = { input: true };

  public headers: TlHeader[] = [{
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
    accessor: (el) => '+' + (el.prefix || '--') + ' ' + el.phone,
    sort: 'phone',
    title: 'Phone',
  }, {
    accessor: (el) => el.companies ? el.companies.length : 0,
    sort: 'companies',
    title: 'Companies',
  }];

  public itemOptions: TlItemOption[] = [{
    callback: this.openViewDetails.bind(this),
    text: 'View Details',
  }, {
    callback: this.openEditUser.bind(this),
    text: 'Edit User',
  }, {
    callback: this.openDeleteUser.bind(this),
    class: 'col-red col-error',
    text: 'DELETE',
  }];

  public activeUsers = false;
  public inactiveUsers = false;
  public profesionalUsers = false;
  public particularUsers = false;

  public defaultExportKvp = [
    { key: 'id', value: '$.id', active: true },
    { key: 'name', value: '$.name', active: true },
    { key: 'dni', value: '$.dni', active: true },
    { key: 'email', value: '$.email', active: true },
  ];

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public us: UserService,
    public companyService: CompanyService,
    public snackbar: MySnackBarSevice,
    public utils: UtilsService,
    public as: AdminService,
    public controles: ControlesService,
  ) { }

  public ngOnInit() {
    const roles = this.us.userData.group_data.roles;
    this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY'); // <<< TODO: Improve
    this.route.queryParams.subscribe((params) => {
      if (!params.sort) {
        this.getUsers();
      }
    });
  }

  public getCleanParams(query?: string) {
    const data: ListAccountsParams = {
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.searchQuery,
      sort: this.sortID,
    };

    return data;
  }

  // Opens add user modal
  public openAddUser() {
    let dialogRef = this.dialog.open(AddUser);
    dialogRef.componentInstance.showCreateNewUser = false;
    dialogRef.componentInstance.addReseller = false;
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef = null;
      this.getUsers();
    });
  }

  // Opens edit user roles modal
  public openEditUser(user, i) {
    const dialogRef = this.dialog.open(EditUserData);
    dialogRef.componentInstance.user = user;
    dialogRef.afterClosed().subscribe((result) => {
      this.getUsers();
    });
  }

  // Opens delete user modal
  public openDeleteUser(user) {
    const dialogRef = this.dialog.open(ConfirmationMessage);
    const accName = this.us.userData.group_data.name;

    dialogRef.componentInstance.status = 'error';
    dialogRef.componentInstance.title = 'Remove user from system?';
    dialogRef.componentInstance.message =
      'Are you sure you want to remove user from the sistem [ ' + accName + ' ]? No going back.';
    dialogRef.componentInstance.btnConfirmText = 'Delete';

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeUser(user);
      }
    });
  }

  public openViewDetails(user) {
    const dialogRef = this.dialog.open(ViewDetails);
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.parent = this;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUsers();
      }
    });
  }

  public viewSMSCode(user) {
    const ref = this.dialog.open(ConfirmationMessage);
    ref.componentInstance.opts = {
      customBtn: true,
      customBtnClick: () => {
        ref.componentInstance.close(true);
        this.resendSMSCode(user);
      },
      customBtnText: 'Resend SMS Code',
    };
    ref.componentInstance.title = 'SMS Code';
    ref.componentInstance.message = 'Code for user <b>' + user.name + '</b>: <code >xfD5fEd</code><br>';
    ref.componentInstance.btnConfirmText = 'Close';
  }

  public resendSMSCode(user) {
    const ref = this.dialog.open(ConfirmationMessage);
    ref.componentInstance.title = 'Resend SMS Code';
    ref.componentInstance.message = 'Are you sure you want to re-send the sms code to user <b>' + user.name + '</b>?';
    ref.componentInstance.btnConfirmText = 'Resend';
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.companyService.companyUsers.slice();
      this.sortID = 'id';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction.toUpperCase();
    }

    this.search();
  }

  public search(query: string = '') {
    this.getUsers(query);
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
    this.getUsers();
  }

  public export() {
    const data: ListAccountsParams = this.getCleanParams();

    delete data.offset;
    delete data.limit;

    const dialogRef = this.dialog.open(ExportDialog);
    dialogRef.componentInstance.filters = data;
    dialogRef.componentInstance.fn = this.as.exportUsersV3.bind(this.as);
    dialogRef.componentInstance.entityName = 'Users';
    dialogRef.componentInstance.defaultExports = [...this.defaultExportKvp];
    dialogRef.componentInstance.list = [...this.defaultExportKvp];

    return dialogRef.afterClosed();
  }

  private getUsers(query: string = '') {
    this.loading = true;
    const data: ListAccountsParams = this.getCleanParams(query);

    this.as.listUsersV3(data)
      .subscribe(
        (resp) => {
          this.companyService.companyUsers = resp.data.elements;
          this.sortedData = this.companyService.companyUsers.slice();
          this.showingUsers = this.companyService.companyUsers.length;
          this.companyService.totalUsers = resp.data.total;
          this.loading = false;
        },
        (error) => { this.loading = false; });
  }

  private removeUser(user) {
    const userIndex = this.companyService.companyUsers.indexOf(user);
    this.companyService.removeUserFromSystem(user.id)
      .subscribe(
        (resp) => {
          this.getUsers();
          this.snackbar.open('Deleted user from system', 'ok');
        },
        (error) => {
          this.snackbar.open('Error deleting user: ' + error._body.message, 'ok');
        });
  }
}
