import { Component } from '@angular/core';
import { NotificationService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  styles: [
    `:host {
      display: block;
      width: auto;
      height: auto;
      position: relative;
    }`,
  ],
  templateUrl: './app-notifications.html',
})
export class AppNotifications {

  public hasNotifications = false;

  constructor(
    public ns: NotificationService,
  ) { }

  public clicked(notif) {
    this.ns.removeNotification(notif);
  }
}
