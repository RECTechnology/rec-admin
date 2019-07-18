import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { BaseService2 } from '../base/base.service-2';
import { UserService } from '../user.service';
import { ErrorManager } from '../error-manager/error-manager';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { API_URL } from '../../data/consts';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class SmsService extends BaseService2 {

  public static ACTION_CHECK = 'check_sms';
  public static ACTION_RESEND = 'resend_sms';
  public static ACTION_RESET = 'reset_sms';
  public static ACTION_VALIDATE = 'validate_phone';

  constructor(
    http: HttpClient,
    public us: UserService,
    public errMan: ErrorManager,
    private snackbar: MySnackBarSevice,
  ) {
    super(http, errMan);
  }

  /**
   * Sms action for user
   */
  public smsAction(user_id: string, action: any, data?): Observable<any> {
    return this.put(
      {},
      null,
      `${API_URL}/admin/v1/user/${user_id}/${action}`,
    ).pipe(map((resp) => resp.data));
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
