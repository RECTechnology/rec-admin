import { Component } from '@angular/core';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AddItemDia } from '../../add-item/add-item.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { Product } from 'src/shared/entities/translatable/product.ent';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { UserService } from 'src/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'tab-products',
  templateUrl: './products.html',
})
export class ProductsTabComponent extends EntityTabBase<Product> {
  public products: Product[] = [];
  public entityName = 'Product';
  public productsColumns = ['id', 'cat', 'esp', 'eng', 'activities-consumed', 'activities-produced', 'actions'];
  public sortElementsToRevise = true;
  public activityConsumedFilter = null;
  public activityProducedFilter = null;
  public activities: Activity[] = [];
  public langMap = {
    cat: 'ca',
    en: 'en',
    es: 'es',
  };
  public dataGetted = false;

  constructor(
    public crud: ProductsCrud,
    public dialog: MatDialog,
    public alerts: AlertsService,
    public translate: TranslateService,
    public actCrud: ActivitiesCrud,
    public us: UserService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(router);
    this.translate.onLangChange.subscribe(() => {
      this.search();
      //this.getActivities();
    });

    this.getActivities();
  }

  public getDataQuery() {
    this.route.queryParams.subscribe((params) => {
      this.limit = params.limit ?? 10;
      this.offset = params.offset;
      this.sortDir = params.sortDir ?? 'asc';
      this.sortID = params.sortID;
      this.query = params.query;

      if (params.sortElementsToRevise != null) {
        params.sortElementsToRevise == 'true';
      }

      for (let activity of this.activities) {
        if (activity.id == params.activityProducedFilterId) {
          this.activityProducedFilter = activity;
        }
        if (activity.id == params.activityConsumedFilterId) {
          this.activityConsumedFilter = activity;
        }
      }
      this.dataGetted = true;
    });
    this.search();
  }

  public showElementsAddQuery(event: MatCheckboxChange) {
    this.sortElementsToRevise = event.checked;

    this.addToQueryParams({
      sortElementsToRevise: this.sortElementsToRevise,
    });
    this.sortID = 'id';
    this.search();
  }

  public getActivities() {
    this.loading = true;
    this.actCrud
      .search(
        {
          offset: 0,
          limit: 300,
          sort: 'name',
          order: 'asc',
        },
        this.langMap[this.us.lang],
      )
      .subscribe((resp) => {
        this.activities = resp.data;
        this.getDataQuery();
      });
  }

  public sortData(sort: MatSort) {
    if (!sort.active || sort.direction === '') {
      this.sortElementsToRevise = true;
    } else if (sort.active !== 'status') {
      this.sortElementsToRevise = false;
    }
    super.sortData(sort);
  }

  public search(query?) {
    this.loading = true;

    this.sortElementsToRevise ? this.sortID = 'status' : this.sortID = this.sortID;

    const default_consuming_by = this.activityConsumedFilter ? [this.activityConsumedFilter.id] : null;
    const default_producing_by = this.activityProducedFilter ? [this.activityProducedFilter.id] : null;

    this.crud
      .search(
        {
          order: this.sortDir,
          limit: this.limit,
          offset: this.offset,
          search: query || this.query || '',
          sort: this.sortID,
          default_consuming_by,
          default_producing_by,
        },
        'all',
      )
      .subscribe(
        (resp) => {
          this.data = resp.data.elements.map(this.mapTranslatedElement);
          this.sortedData = this.data.slice();
          this.total = resp.data.total;
          this.list.updateData(this.data);
          if (this.dataGetted) {
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
        },
      );
  }

  public editProducts(product, skip = false) {
    this.confirm('WARNING', 'ACTIVITY_DESC', 'Edit', 'warning', skip).subscribe((proceed) => {
      if (proceed) {
        this.alerts
          .openModal(AddItemDia, {
            isEdit: true,
            isProduct: true,
            item: Object.assign({}, product),
            itemType: 'PRODUCT',
          })
          .subscribe((updated) => {
            if (updated) {
              this.loading = true;
              this.crud
                .update(
                  product.id,
                  {
                    name_ca: updated.name_ca,
                    name_es: updated.name_es,
                    name: updated.name,
                  },
                  'en',
                )
                .subscribe(
                  (resp) => {
                    this.alerts.showSnackbar('UPDATED_PRODUCT', 'ok');
                    this.loading = false;
                    this.search();
                  },
                  (error) => {
                    this.alerts.showSnackbar(error.message);
                    this.loading = false;
                  },
                );
            }
          });
      }
    });
  }

  public addProduct() {
    this.alerts
      .openModal(AddItemDia, {
        isEdit: false,
        isProduct: true,
        itemType: 'PRODUCT',
      })
      .subscribe((created) => {
        if (created) {
          this.loading = true;
          this.crud
            .create(
              {
                name: created.name,
                name_ca: created.name_ca,
                name_es: created.name_es,
                description: '',
                status: 'reviewed',
              },
              'en',
            )
            .subscribe(
              (prod) => {
                this.alerts.showSnackbar('CREATED_PRODUCT', 'ok');
                this.loading = false;
                this.search();
              },
              (error) => {
                this.loading = false;
                this.alerts.showSnackbar(error.message);
              },
            );
        }
      });
  }

  public deleteProduct(product) {
    this.confirm('DELETE_PRODUCT?', 'SURE_DELETE_THAT').subscribe(
      (del) => {
        if (del) {
          this.crud.remove(product.id).subscribe(
            (resp) => {
              this.alerts.showSnackbar('DELETED_PRODUCTS', 'ok');
              this.search();
            },
            (error) => this.alerts.showSnackbar(error.message),
          );
        }
      },
    );
  }

  public aproveProduct(product) {
    this.confirm('Confirm product', 'APROVE_DESC', 'APROVE', 'warning').subscribe((aprove) => {
      if (aprove) {
        this.crud.update(product.id, { status: 'reviewed' }).subscribe(
          (resp) => {
            this.alerts.showSnackbar('APROVED_PRODUCT', 'ok');
            this.search();
          },
          (error) => this.alerts.showSnackbar(error.message),
        );
      }
    });
  }

  public selectActivityConsumedToFilter(activity) {
    this.activityConsumedFilter = activity;
    this.addToQueryParams({
      activityConsumedFilterId: activity? activity.id:null,
    });
    this.search();
  }

  public selectActivityProducedToFilter(activity) {
    this.activityProducedFilter = activity;
    this.addToQueryParams({
      activityProducedFilterId: activity? activity.id:null,
    });
    this.search();
  }
}
