import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { B2bService } from 'src/services/b2b/b2b.service';
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
  public providers = [
    {
      description: 'Empresa A, Empresa B, Empresa C',
      name: 'Insumo 1',
    },
    {
      description: 'Empresa A, Empresa B, Empresa C',
      name: 'Insumo 2',
    },
    {
      description: null,
      name: 'Insumo 3',
    },
  ];

  public clients = [
    {
      description: 'Pan, Bollos, etc...',
      name: 'Producto 1',
    },
    {
      description: 'Pan, Bollos, etc...',
      name: 'Producto 2',
    },
    {
      description: null,
      name: 'Producto 3',
    },
  ];

  @Input() public id = '';
  @Input() public pdfHtml = '';
  @Input() public langs = LANGS;
  @Input() public lang = LANG_MAP[localStorage.getItem('lang') || 'en'] || LANGS[1];

  public langMap = {
    cat: 'ca',
    en: 'en',
    es: 'es',
  };

  constructor(
    public b2bCrud: B2bService,
    public crudAccounts: AccountsCrud,
    public utils: UtilsService,
    public cs: CompanyService,
    private changeDetector: ChangeDetectorRef,
    public us: UserService,
    public translate: TranslateService,
  ) {
    this.lang = LANG_MAP[us.lang];
    translate.onLangChange.subscribe(resp => {
      this.getPdfAsHtml();
    });
  }

  public selectLang(lang) {
    this.lang = lang;
    this.us.lang = lang.abrev;
    this.getPdfAsHtml();
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
