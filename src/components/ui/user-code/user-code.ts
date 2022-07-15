import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { User } from '../../../shared/entities/user.ent';

@Component({
  selector: 'user-code',
  templateUrl: './user-code.html',
})
export class UserCode {
  @Input() public user: User;

  constructor(
    public router: Router,
  ) { }

  redirectTo(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([`/users/${this.user.id}`]));
 }
}