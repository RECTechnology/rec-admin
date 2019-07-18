import { Component, AfterContentInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { ControlesService } from '../../services/controles/controles.service';
import { MatDialog } from '@angular/material';
import { AddUser } from '../dialogs/add-user/add-user.dia';
import { ConfirmationMessage } from '../../components/dialogs/confirmation-message/confirmation.dia';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth.service';

declare let Morris;

@Component({
  selector: 'companies',
  styleUrls: [
    '../../pages/companies/companies.css',
  ],
  templateUrl: '../../pages/companies/companies.html',
})
export class CompaniesComponent extends PageBase implements AfterContentInit {
  public totalAccounts = 0;
  public accountList = [];
  public refered_url = '';
  public pageName = 'Companies';

  constructor(
    private controles: ControlesService,
    private us: UserService,
    private dialog: MatDialog,
    public titleService: Title,
    private snackbar: MySnackBarSevice,
    public ls: LoginService,
  ) {
    super();
  }

  public afterContentInit() {
    this.refered_url = location.origin + '/register/' + this.us.getReferalCode();
  }

  public openAddUsers(id) {
    let dialogRef = this.dialog.open(AddUser);
    dialogRef.componentInstance.group_id = id;
    dialogRef.componentInstance.showCreateNewUser = false;
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef = null;
    });
  }

  public showConfirmDelete(account, index) {
    const dialogRef = this.dialog.open(ConfirmationMessage);
    const accName = account.name;

    dialogRef.componentInstance.status = 'error';
    dialogRef.componentInstance.title = 'Delete account __';
    dialogRef.componentInstance.message = 'Are you sure you want to delete account: __? (no going back)';
    dialogRef.componentInstance.btnConfirmText = 'Delete';
    dialogRef.componentInstance.data = { name: accName };

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // If user click 'Delete' we proceed to delete user
        // account.deleting = true;
        this.removeAccount(account, index);
      }
    });
  }

  private removeAccount(account, index) {
    this.us.removeAccountV2(this.us.getGroupId(), account.id)
      .subscribe(
        (resp) => {
          this.snackbar.open('Removed account ' + account.name + ' correctly!', 'ok', { duration: 3500 });
          this.accountList.splice(index, 1);
        }, (error) => {
          this.snackbar.open(error._body
            ? error._body.message
            : 'There has been an error, please try again or contact us if error persists.', 'ok', {
              duration: 3500,
              panelClass: ['bg-error'],
            });
        });
  }
}
