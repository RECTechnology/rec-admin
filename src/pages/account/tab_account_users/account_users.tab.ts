import { Component, AfterContentInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, Sort } from '@angular/material';
import { WalletService } from '../../../services/wallet/wallet.service';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { ConfirmationMessage } from '../../../components/dialogs/confirmation-message/confirmation.dia';
import { CompanyService } from '../../../services/company/company.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { EditUserData } from '../../dialogs/edit-user/edit-user.dia';
import { AddUser } from '../../dialogs/add-user/add-user.dia';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { Brand } from '../../../environment/brand';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'account-users-tab',
  styleUrls: ['./tab_account_users.css'],
  templateUrl: './tab_account_users.html',
})
export class AccountUsersTab implements AfterContentInit {
  public loading = false;
  public canAddUser = false;
  public searchQuery = '';
  public offset = 0;
  public limit = 10;
  public showingAccounts = 0;
  public totalUsers = 0;
  public account_id = null;
  public items: any[] = [];
  public sortedData: any[] = [];
  public brand = Brand;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private us: UserService,
    private companyService: CompanyService,
    private adminService: AdminService,
    private utils: UtilsService,
    public router: Router,
    public controles: ControlesService,
    public ws: WalletService,
    public snackbar: MySnackBarSevice,
  ) {

    this.route.params
      .subscribe((params) => {
        this.account_id = params.id;
      });
  }

  public ngAfterContentInit() {
    this.loading = true;
    const roles = this.us.userData.group_data.roles;
    this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY'); // <<< TODO: Improve
    this.getUsers();
  }

  // Opens add user modal
  public openViewDetails(user) {
    return;
  }

  public openAddUser() {
    let dialogRef = this.dialog.open(AddUser);
    dialogRef.componentInstance.group_id = this.account_id;
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef = null;
      this.getUsers();
    });
  }

  public openEditUser(user) {
    let dialogRef = this.dialog.open(EditUserData);
    dialogRef.componentInstance.user = user;
    // dialogRef.componentInstance.title = 'Edit account';
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef = null;
      this.getUsers();
    });
  }

  // Opens delete user modal
  public openDeleteUser(user) {
    const dialogRef = this.dialog.open(ConfirmationMessage);

    dialogRef.componentInstance.status = 'error';
    dialogRef.componentInstance.title = 'Expel user (' + user.username + ') from account';
    dialogRef.componentInstance.message =
      'Are you sure you want to expel user from account [ ' + this.account_id + ' ]?';
    dialogRef.componentInstance.btnConfirmText = 'EXPEL';

    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      if (result) {
        // If user click 'Delete' we proceed to delete user
        this.removeUser(user);
      }
    });
  }

  public keyPressed(user, event) {
    console.log(event);
  }

  public sortData(sort: Sort): void {
    const data = this.items.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      // tslint:disable-next-line: no-shadowed-variable
      return ((a, b, isAsc) => (a < b ? -1 : 1) * (isAsc ? 1 : -1))(a[sort.active], b[sort.active], isAsc);
    });
  }

  public search() {
    // Perform search
    this.getUsers();
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
    this.getUsers();
  }

  private getUsers() {
    console.log('Offset: ', this.offset);
    console.log('Limit: ', this.limit);
    console.log('Query: ', this.searchQuery);

    this.companyService.getGroupUsers(this.account_id, this.offset, this.limit)
      .subscribe(
        (resp) => {
          this.loading = false;
          this.items = resp.data.elements;
          this.totalUsers = resp.data.total;
          this.sortedData = this.items.slice(this.offset, this.limit);
        },
        (error) => { this.loading = false; });
  }

  private removeUser(user) {
    const userIndex = this.companyService.companyUsers.indexOf(user);
    this.adminService.removeUserFromAccount(this.account_id, user.id)
      .subscribe(
        (resp) => {
          this.snackbar.open('Expeled user currectly!', 'ok');
          this.getUsers();
        },
        (error) => {
          this.snackbar.open(error._body.desciption, 'ok');
          console.log(error);
        });
  }
}
