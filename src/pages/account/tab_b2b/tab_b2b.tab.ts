import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { LANGS, LANG_MAP } from 'src/data/consts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'b2b-module',
  templateUrl: './tab_b2b.html',
})
export class B2BModuleTab {
  @Input() public id = '';
  @Input() public pdfHtml = '';
  @Input() public langs = LANGS;
  @Input() public account: any = { kyc_manager: { locale: 'es' } };
  @Input() public lang = LANG_MAP[localStorage.getItem('lang') || 'en'] || LANGS[1];

  public langMap = {
    cat: 'ca',
    en: 'en',
    es: 'es',
  };

  constructor(
    public crudAccounts: AccountsCrud,
    public utils: UtilsService,
    public cs: CompanyService,
    private changeDetector: ChangeDetectorRef,
    public us: UserService,
    public translate: TranslateService,
  ) {
    this.lang = LANG_MAP[this.account.kyc_manager.locale];
  }

  public ngAfterContentInit() {
    this.getPdfAsHtml();
  }

  public getPdfAsHtml() {
    this.crudAccounts.getPdfAsHtml(this.id, this.langMap[this.lang.abrev])
      .subscribe(
        (resp) => {
          this.pdfHtml = resp;
          this.changeDetector.detectChanges();
        }, (error) => {
          console.log(error);
        },
      );
  }

  public sendB2b() {
    this.crudAccounts.getPdf(this.id, this.langMap[this.lang.abrev])
      .subscribe(
        (resp) => {
          const date = new Date().toLocaleDateString().replace(/ /g, '-');
          const name = `${this.cs.selectedCompany.name}-report-${date}.pdf`;
          this.utils.downloadBlob(resp, name);
        }, (error) => {
          console.log(error);
        },
      );
  }
}
