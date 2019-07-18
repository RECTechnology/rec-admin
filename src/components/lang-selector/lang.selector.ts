import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGS, LANG_MAP } from '../../data/consts';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth.service';

@Component({
  selector: 'lang-selector',
  templateUrl: '../../components/lang-selector/lang.selector.html',
})
export class LangSelector {

  public langs = LANGS;
  public lang = LANG_MAP[localStorage.getItem('lang') || 'en'] || LANGS[1];

  constructor(
    private translate: TranslateService,
    private us: UserService,
    private ls: LoginService,
  ) { }

  public selectLang(lang) {
    this.lang = lang;
    this.us.lang = lang;
    this.translate.use(this.lang.abrev);
    localStorage.setItem('lang', this.lang.abrev);
  }
}
