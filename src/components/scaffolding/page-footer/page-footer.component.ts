import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'page-footer',
  templateUrl: './page-footer.html',
})
export class PageFooterComponent {
  public brand = environment.Brand;
  public env = environment;
  public year = (new Date()).getFullYear();
}
