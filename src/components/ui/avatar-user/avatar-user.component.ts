import { Component, Input } from '@angular/core';

import { environment } from 'src/environments/environment';

import { User } from '../../../shared/entities/user.ent';

@Component({
  selector: 'avatar-user',
  styleUrls: ['./avatar-user.scss'],
  templateUrl: './avatar-user.html',
})
export class AvatarUser {
  @Input() public user: User;
  @Input() public size: number = 20;
  @Input() public description: boolean = false;
  @Input() public link: boolean = false;

  @Input() public nameAccessor: string = 'name';
  @Input() public imageAccessor: string = 'profile_image';

  public Brand = environment.Brand;

  constructor() {}

  
}