import { environment } from '../environments/environment';

export class BaseComponent {
  public environment = environment;
  public brand = environment.Brand;
  public loading: boolean = false;
  public offset: number = 0;
  public limit: number = 10;

  /** Maybe add
  *  > public sortedData: any[] = [];
  * Here instead of each component that paginates items
  * As it beeing used in more than 4 pages
  */
  public trackByFn(index, item) {
    return index;
  }
}
