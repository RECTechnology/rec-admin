import { TranslateService } from '@ngx-translate/core';
import { Observable, zip } from 'rxjs';
import { Inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

export class MdI18n extends MatPaginatorIntl {
  public itemsPerPageLabel = 'Elementos por página: ';
  public nextPageLabel = 'Página siguiente';
  public previousPageLabel = 'Página anterior';

  constructor(@Inject(TranslateService) private translate) {
    super();
    this.setUpLang();
  }

  public getRangeLabel = function (page: number, pageSize: number, length: number): string {
    this.setUpLang();
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }

  private setUpLang() {
    const localSavedLang = localStorage.getItem('lang');
    const currentLang = localSavedLang || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(currentLang);

    zip(this.translate.get('I_PER_PAGE'), this.translate.get('NEXT_PAGE'), this.translate.get('PREV_PAGE'))
      .subscribe((res: any) => {
        this.itemsPerPageLabel = res[0];
        this.nextPageLabel = res[1];
        this.previousPageLabel = res[2];
      });
  }

}
