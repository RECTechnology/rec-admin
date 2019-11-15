import { Component, Input } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'avatar',
  styleUrls: ['./avatar.scss'],
  templateUrl: './avatar.html',
})
export class Avatar {
  @Input() public account: Account;
  @Input() public size: number = 20;
  @Input() public description: boolean = false;

  @Input() public nameAccessor: string = 'name';
  @Input() public imageAccessor: string = 'company_image';

  public Brand = environment.Brand;
}
