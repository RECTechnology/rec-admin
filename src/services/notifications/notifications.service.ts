import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';

export interface Notification {
    title: string;
    description: string;
    id?: number | string;
    icon?: string;
    link?: string;
    body?: string;
}

@Injectable()
export class NotificationService extends BaseService {

    public notifications: Notification[] = [];

    constructor(
        http: HttpClient,
        public us: UserService,
    ) { super(http, us); }

    public get hasNotifications(): boolean {
        return this.count > 0;
    }

    public get count(): number {
        return this.notifications.length;
    }

    public exists(notif: Notification) {
        return this.notifications.find((el) => el.id === notif.id);
    }

    public addNotification(notif: Notification) {
        if (!this.exists(notif)) {
            const id = this.notifications.length;
            this.notifications.push({ id, ...notif });
            return id;
        }
        return notif.id;
    }

    public removeNotification(id: number) {
        return this.notifications.splice(id, 1);
    }
}
