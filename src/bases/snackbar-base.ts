import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, zip } from 'rxjs';

@Injectable()
export class MySnackBarSevice {

  public static DEFAULT_OPTS = {
    duration: 6e3,
  };
  constructor(
    private snackbar: MatSnackBar,
    private translate: TranslateService,
  ) { }

  public open(message: string, action: string = 'OK', options?: MatSnackBarConfig) {
    options = { ...options, ...MySnackBarSevice.DEFAULT_OPTS };
    return zip(this.translate.get(message), this.translate.get(action))
      .subscribe(
        (resp) => {
          const [msg, okMsg] = resp;
          this.snackbar.open(msg, okMsg, options);
        },
      );
  }
}
