import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Pipe({
  name: 'tolang',
})
export class ConvertToLangPipe implements PipeTransform {
  public langMap = {
    cat: 'ca',
    en: 'en',
    eng: 'en',
    es: 'es',
    esp: 'es',
  };

  constructor(
    public us: UserService,
  ) { }

  public transform(value: any, ...args: any[]): any {
    const lang = this.langMap[this.us.lang];
    return value['name_' + lang] || value.name;
  }
}
