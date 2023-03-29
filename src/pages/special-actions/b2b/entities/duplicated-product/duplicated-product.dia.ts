import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'duplicated-product',
  styleUrls: ['./duplicated-product.scss'],
  templateUrl: './duplicated-product.dia.html',
})
export class DuplicatedProduct {
  public currentItem = 0;
  public allItems = 2;
  public items = [
    {
      name: 'Test',
      name_es: 'test',
      name_ca: 'proba',
      name_plural: 'Tests',
      name_es_plural: 'tests',
      name_ca_plural: 'probes',
    },
    {
      name: 'Testasa',
      name_es: 'tesasddast',
      name_ca: 'probasddsa',
      name_plural: 'Teadsdassts',
      name_es_plural: 'tdsaadests',
      name_ca_plural: 'prasdobes',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<DuplicatedProduct>,
    public us: UserService,
    public translate: TranslateService,
    public activitiesCrud: ActivitiesCrud,
    public productsCrud: ProductsCrud,
    public alerts: AlertsService,
  ) {
    // this.activitiesCrud
    //   .search({ offset: 0, limit: 100, sort: 'name', order: 'asc' }, this.langMap[this.us.lang])
    //   .subscribe((resp) => this.setActivities(resp));
  }

  public close(): void {
    this.dialogRef.close(false);
  }
  public prevItem() {
    this.currentItem -= 1;
    if (this.currentItem < 0) this.currentItem = 0;
  }
  public nextItem() {
    this.currentItem += 1;
    if (this.currentItem > this.allItems) this.currentItem = this.allItems;
  }
}
