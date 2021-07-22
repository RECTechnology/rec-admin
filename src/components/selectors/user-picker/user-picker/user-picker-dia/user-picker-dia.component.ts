import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { User } from 'src/shared/entities/user.ent';
import { UsersCrud } from 'src/services/crud/users/users.crud';

@Component({
  selector: 'app-user-picker-dia',
  templateUrl: './user-picker-dia.component.html',
  styleUrls: ['./user-picker-dia.component.scss']
})
export class UserPickerDiaComponent  {

  public currentUserId = null;
  public users: User[] = [];
  public filters = {};
  public type = null;

  public Brand = environment.Brand;
  public loading = true;

  constructor(
    public dialogRef: MatDialogRef<UserPickerDiaComponent>,
    public userCrud: UsersCrud,
  ) {}

  public search(query) {
    console.log("Im in search ");
    const opts = {
      offset: 0,
      limit: 50,
      type: this.type,
      search: query,
      ...this.filters,
    };

    this.loading = true;
    this.userCrud.list(opts)
      .subscribe((resp) => {
        this.users = resp.data.elements;
        this.loading = false;
      });
  }

  public select(user) {
    this.close(user);
  }

  public close(user = null): void {
    this.dialogRef.close(user);
  }

}
