import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class SmsService extends BaseService {

  public static ACTION_CHECK = 'check_sms';
  public static ACTION_RESEND = 'resend_sms';
  public static ACTION_RESET = 'reset_sms';
  public static ACTION_VALIDATE = 'validate_phone';

  constructor(
    http: HttpClient,
    public us: UserService,
  ) {
    super(http, us);
  }

  /**
   * Sms action for user
   */
  public smsAction(user_id: string, action: any, data: any = {}): Observable<any> {
    return this.put(
      data,
      null,
      `${API_URL}/admin/v1/user/${user_id}/${action}`,
    ).pipe(map((resp) => resp ? resp.data : {}));
  }

  public check(user_id) {
    return this.smsAction(user_id, SmsService.ACTION_CHECK);
  }

  public resend(user_id) {
    return this.smsAction(user_id, SmsService.ACTION_RESEND);
  }

  public reset(user_id) {
    return this.smsAction(user_id, SmsService.ACTION_RESET);
  }

  public validate(user_id) {
    return this.smsAction(user_id, SmsService.ACTION_VALIDATE);
  }

  /**
   * Returns the current `access_token`
   * @return {string} string
   */
  public getToken(): string {
    return this.us.tokens.access_token;
  }
}
