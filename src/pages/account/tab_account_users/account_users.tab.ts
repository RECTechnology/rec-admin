import { Component, AfterContentInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { CompanyService } from '../../../services/company/company.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { EditUserData } from '../../../dialogs/management/edit-user/edit-user.dia';
import { AddUserDia } from '../../../dialogs/management/add-user/add-user.dia';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../../services/admin/admin.service';
import { ViewDetails } from 'src/dialogs/management/view-details/view-details.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';

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
  public brand: any = environment.Brand;

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public us: UserService,
    public companyService: CompanyService,
    public adminService: AdminService,
    public utils: UtilsService,
    public router: Router,
    public controles: ControlesService,
    public alerts: AlertsService,
  ) {

    this.route.params
      .subscribe((params) => {
        this.account_id = params.id;
      });
  }

  public ngAfterContentInit() {
    this.loading = true;
    const roles = this.us.userData.group_data.roles;
    this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY');
    this.getUsers();
  }

  // Opens add user modal
  public openViewDetails(elem?, i?) {
    this.alerts.openModal(ViewDetails, {
      parent: this,
      user: elem,
    }).subscribe(() => {
      this.getUsers();
    });
  }

  public openAddUser() {
    this.alerts.openModal(AddUserDia, {
      group_id: this.account_id,
    }).subscribe(() => {
      this.getUsers();
    });
  }

  public openEditUser(user, i?) {
    this.alerts.openModal(EditUserData, { user })
      .subscribe(() => {
        this.getUsers();
      });
  }

  // Opens delete user modal
  public openDeleteUser(user) {
    this.alerts.showConfirmation(
      'Are you sure you want to expel user from account [ ' + this.account_id + ' ]?',
      'Expel user (' + user.username + ') from account',
      'EXPEL',
      'error',
    ).subscribe((result) => {
      if (result) {
        // If user click 'Delete' we proceed to delete user
        this.removeUser(user);
      }
    });
  }

  public keyPressed(user, event) { }

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

  public getUsers() {
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

  public removeUser(user) {
    const userIndex = this.companyService.companyUsers.indexOf(user);
    this.adminService.removeUserFromAccount(this.account_id, user.id)
      .subscribe(
        (resp) => {
          this.alerts.showSnackbar('Expeled user currectly!', 'ok');
          this.getUsers();
        },
        (error) => {
          this.alerts.showSnackbar(error.desciption, 'ok');
        });
  }
}
