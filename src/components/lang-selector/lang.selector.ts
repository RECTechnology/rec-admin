import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGS, LANG_MAP } from '../../data/consts';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth/auth.service';

@Component({
  selector: 'lang-selector',
  templateUrl: '../../components/lang-selector/lang.selector.html',
})
export class LangSelector {

  @Input() public langs = LANGS;
  @Input() public lang = LANG_MAP[localStorage.getItem('lang') || 'en'] || LANGS[1];
  @Input() public mode: 'default' | 'event' = 'default';
  @Output('changed') public onChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private us: UserService,
    private ls: LoginService,
  ) { }

  public ngOnInit() {
    console.log('lang', this.lang);
  }

  public selectLang(lang) {
    this.lang = lang;
    this.us.lang = lang.abrev;
    if (this.mode === 'default') {
      this.translate.use(this.lang.abrev);
      localStorage.setItem('lang', this.lang.abrev);
    } else {
      this.onChange.emit(this.lang);
    }
  }
}
