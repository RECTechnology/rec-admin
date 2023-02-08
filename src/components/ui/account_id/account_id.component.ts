import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'account-id',
  templateUrl: './account_id.html',
})
export class AccountIdTableColumn {
  @Input() public account_id: number;
  @Input() public size: number = 20;
  @Input() public description: boolean = false;
  @Input() public link: boolean = false;

  @Input() public nameAccessor: string = 'name';
  @Input() public imageAccessor: string = 'company_image';

  constructor(
    public router: Router,
  ) { }

  public onClick() {
    if (this.link) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([`/accounts/${this.account_id}`]));
    }else {
      return;
    }
  }
}