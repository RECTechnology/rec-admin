import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  public getAndInitTranslations() {
    this.translate.get(['I_PER_PAGE', 'NEXT_PAGE', 'PREV_PAGE'])
      .subscribe((translation) => {
        this.itemsPerPageLabel = translation.I_PER_PAGE;
        this.nextPageLabel = translation.NEXT_PAGE;
        this.previousPageLabel = translation.PREV_PAGE;
        this.changes.next();
      });
  }

  public getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}