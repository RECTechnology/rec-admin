import { Injectable, VERSION } from '@angular/core';
import { BaseService } from './base/base.service';
import { UserService } from './user.service';
import { ErrorManager } from './error-manager/error-manager';
import { API_URL } from '../data/consts';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService extends BaseService {

  public API_VERSION = 'pre';

  constructor(
    http: HttpClient,
    public us: UserService,
    public errMan: ErrorManager,
  ) {
    super(http, us, errMan);
  }

  public getInfo() {
    return this.get(null, null, `${API_URL}/system/v1/version`);
  }

  public getStatus() {
    return this.get(null, null, `${API_URL}/public/v1/status`).pipe(map((resp) => resp.data));
  }

  /**
  * @param title            { String } the report title
  * @param description      { String } the error description
  * @param snapshot         { String } the site screenshot base64
  * @param errors #optional { File }   the site screenshot
  */
  public sendErrorReport(title: string, description: string, snapshot: string, errors?, path?) {
    const date = (new Date()).toLocaleString();

    const errorString =
      `\nPath: ${path}` +
      `\nDate: ${date}` +
      `\nUsername: ${this.us.userData.username}` +
      `\nEmail: ${this.us.userData.email}\n` +
      this.getReportData(errors);

    const rName = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
    const encodedErrorString = 'data:text/plain;base64,' + btoa(errorString);

    const snapshotFile = snapshot ? this.b64toFile(snapshot, rName() + '.png') : null;
    const errorsFile = errorString ? this.b64toFile(encodedErrorString, rName() + '.txt') : null;
    const params = { title, description, snapshot: snapshotFile, errors: errorsFile };

    return this.xhrcall(params, 'POST',
      'issue/report',
      'application/x-www-form-urlencoded');
  }

  private b64toFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  private getReportData(errors) {
    const {
      userAgent,
      vendor,
      languages,
      language,
      platform,
      appCodeName,
      appName,
      appVersion,
    } = navigator;

    const nav = {
      language,
      languages,
      platform,
      userAgent,
      vendor,
    };

    const location_href = location.href;

    const app = {
      code_name: appCodeName,
      name: appName,
      version: appVersion,
    };

    const storage = JSON.parse(JSON.stringify(localStorage));
    const keysToRemove = [
      'user.tokens',
      'app.tokens',
    ];
    for (const key in storage) {
      if (keysToRemove.indexOf(key) !== -1 || key.indexOf('___USR___') !== -1) {
        delete storage[key];
      }
    }

    const userInfo = {
      angularVersion: VERSION,
      app,
      errors: errors.map((x) => ({
        body: x._body,
      })), localStorage: storage,
      location: location_href,
      navigator: nav,
      platform,
    };

    return JSON.stringify(userInfo, null, 4);
  }
}
