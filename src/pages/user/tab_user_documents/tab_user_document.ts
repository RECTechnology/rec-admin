import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { SmsService } from 'src/services/sms/sms.service';

@Component({
  providers: [SmsService],
  selector: 'user-document-tab',
  templateUrl: './tab_user_document.html',
})
export class UserDocumentsTab implements OnInit {
  public user: any = {};
  public user_id = null;
  public Brand: any = environment.Brand;

  constructor(
    private route: ActivatedRoute,
    public alerts: AlertsService,
    public usersCrud: UsersCrud,
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.user_id = params.id;
    });
    this.getUser();

  }

  public getUser() {
    this.usersCrud.find(this.user_id).subscribe((res) => {
      this.user = res.data;
    });
  }
 
}
