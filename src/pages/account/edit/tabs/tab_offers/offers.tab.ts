import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Component({
  selector: 'tab-offers',
  templateUrl: './offers.html',
  styleUrls: ['./offers.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersTab {
  @Input() public id = '';
  @Input() public account: Account;
  @Output() public close: EventEmitter<any> = new EventEmitter();
  @Input() public loading: boolean = false;
  public pageName = 'Offers';
  public addedText = ' ...';
  @ViewChild('textDesc', { static: false }) public textDescElement: ElementRef;

  constructor(  
    public accountsCrud: AccountsCrud,
    public snackbar: MySnackBarSevice,
  ) {}


 
}
