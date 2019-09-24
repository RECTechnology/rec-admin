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
    return (value.translations && value.translations[this.langMap[this.us.lang]])
      ? (value.translations[this.langMap[this.us.lang]].name || value.name)
      : value.name;
  }
}
